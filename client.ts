const api = "https://menetrendek.hu/menetrend/interface/index.php"

const allNetworks = [
    1,
    2,
    3,
    10,
    11,
    12,
    13,
    14,
    24,
    25
]

export const dateString = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export const autocomplete = async (query: any) => {
    const { input } = query
    const date = new Date()
    const body = {
        "func": "getStationOrAddrByTextC",
        "params": {
            "inputText": input,
            "searchIn": [
                "stations"
            ],
            "searchDate": dateString(date),
            "maxResults": 50,
            networks: allNetworks,
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const stationsNear = async (query: any) => {
    const { latitude, longitude } = query
    const date = new Date()
    const body = {
        "query": "get_lsid_by_coordsC",
        "datum": "2022-11-06",
        "wgslat": latitude,
        "wgslon": longitude,
        "radius": 1500,
        "networks": allNetworks
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export type route = {
    departure: Array<string>;
    departureTime: string;
    departurePlatform?: number;
    arrival: Array<string>;
    arrivalTime: string;
    arrivalPlatform?: number;
    transfers: number;
    duration: string;
    distance: string;
    operates: string;
    riskyTransfer: boolean;
    fare: number;
    networks: Array<number>;
    expositionData: {
        nativeData: any,
        exposition: any
    },
}

export const routes = async (query: any, lang: string) => {
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": query.date,
            "ext_settings": "block",
            "honnan_ls_id": query.from.ls_id || 0,
            "honnan_settlement_id": query.from!.s_id,
            "honnan_site_code": query.from!.site_code || "",
            "hour": 0,
            "min": 0,
            "hova_ls_id": query.to.ls_id || 0,
            "hova_settlement_id": query.to!.s_id,
            "hova_site_code": query.to!.site_code || "",
            "maxatszallas": '5',
            "maxwalk": 1000,
            "timeWindow": 0,
            "naptipus": 0,
            "odavissza": 0,
            "preferencia": 0,
            "rendezes": "1",
            "discountPercent": "0",
            "utirany": "oda",
            "var": '0',
            "lang": lang,
            "dayPartText": "Egész nap",
            "orderText": "Indulási idő",
            "networks": allNetworks,
        }
    }
    const result = await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
    if (result.status === "success") {
        const routesArr = Object.values(result.results.talalatok).map((item: any) => ({
            departure: [item.departureCity, item.departureStation],
            departureTime: item.indulasi_ido,
            departurePlatform: parseInt(item.nativeData[0].FromBay),
            arrival: [item.arrivalCity, item.arrivalStation],
            arrivalTime: item.erkezesi_ido,
            arrivalPlatform: parseInt(item.nativeData.at(-1).ToBay),
            transfers: item.atszallasok_szama,
            duration: item.osszido,
            distance: item.ossztav,
            operates: item.kozlekedik,
            riskyTransfer: item.riskyTransfer,
            fare: item.totalFare,
            networks: Object.values(item.jaratinfok).map((item: any) => item.network),
            expositionData: {
                nativeData: item.nativeData,
                exposition: item.kifejtes_postjson
            },
        }))
        return { status: result.status, routes: routesArr || [], fromSettle: result.nativeResults.Params["FromSettle:"], toSettle: result.nativeResults.Params["ToSettle:"] }
    } else {
        return { status: result.status, routes: [], fromSettle: "", toSettle: "" }
    }
}

export type exposition = {
    provider?: string;
    action: "átszállás" | "leszállás" | "felszállás";
    station: string;
    time: string;
    network?: number;
    fare?: number;
    departurePlatform?: number;
    arrivalPlatform?: number;
    distance?: string;
    operates?: string;
    runId: string;
    timeForTransfer?: string;
    stations?: string
    duration?: number,
    runsData?: {
        runId: string,
        sls: string,
        els: string,
    }
}

export const exposition = async (fieldvalue: any, nativeData: any, datestring: string, lang: string) => {
    const body = {
        "debug": 0,
        "type": "",
        "query": "jarat_kifejtes_text_jsonC",
        "datum": datestring,
        "lang": lang,
        "fieldvalue": fieldvalue,
        "nativeData": nativeData
    }
    const result = await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
    let myExposition: Array<any> = []
    if (result.status === "success") {
        myExposition = Object.values(result.results).map((item: any) => ({
            provider: item.OwnerName,
            action: item.muvelet,
            station: item.allomas,
            time: item.idopont,
            runId: item.jaratszam,
            network: parseInt(item.network),
            fare: item.jaratinfo?.fare,
            departurePlatform: item.jaratinfo ? parseInt(item.jaratinfo.FromBay) : null,
            arrivalPlatform: item.jaratinfo ? parseInt(item.jaratinfo.ToBay) : null,
            distance: item.jaratinfo?.utazasi_tavolsag,
            operates: item.jaratinfo?.kozlekedik,
            ...((`${item.vegallomasok}`).startsWith("Átszállás") ? { timeForTransfer: (`${item.vegallomasok}`).replace("Átszállásra rendelkezésre álló idő", "Idő az átszállásra") } : { stations: item.vegallomasok }),
            ...(item.muvelet === "felszállás" ? {
                runsData: {
                    runId: item.runId,
                    sls: item.jaratinfo?.StartStation,
                    els: item.jaratinfo?.EndStation
                }
            } : {}),
            duration: item.jaratinfo ? parseInt(item.jaratinfo?.travelTime) : null
        }))
    }
    return { status: result.status, exposition: myExposition }
}

export const runs = async (id: number, datestring: string, sls: number, els: number) => {
    const body = {
        "query": "runDecriptionC",
        "run_id": id,
        "sls_id": sls, // dep,
        "els_id": els, // arr
        "datum": datestring
    }
    let resp = { ...(await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()), custom: [] }
    let i2 = -1
    Object.keys(resp.results.kifejtes_sor).map((i: any) => {
        let item = resp.results.kifejtes_sor[i]
        item["utveg"] = resp.results.kifejtes_sor[Number(i) + 1]?.erkezik
        item["varhato_indul"] = item["varhato_indul"] === "n.a." ? null : item["varhato_indul"]
        item["varhato_erkezik"] = item["varhato_erkezik"] === "n.a." ? null : item["varhato_erkezik"]
        if (item["varhato_indul"] === item["indul"]) { item["varhato_indul"] = null }
        if (item["varhato_erkezik"] === item["erkezik"]) { item["varhato_erkezik"] = null }
        const lastItem = resp.results.kifejtes_sor[i - 1] ? resp.results.kifejtes_sor[i - 1] : { departureCity: null }
        if (lastItem.departureCity !== item.departureCity) {
            i2++
            resp.custom[i2] = { departureCity: item.departureCity, items: [item] }
        } else {
            resp.custom[i2].items = [...resp.custom[i2].items, item]
        }
    })
    Object.keys(resp.custom).map((i: any) => {
        resp.custom[i].start = resp.custom[i].items[0].erkezik || resp.custom[i].items[0].indul
        resp.custom[i].varhato_start = resp.custom[i].items[0].varhato_erkezik
        if (resp.custom[i].varhato_start == resp.custom[i].start) { resp.custom[i].varhato_start = null }
        resp.custom[i].end = resp.custom[Number(i) + 1]?.items[0].erkezik || resp.custom[i].items[resp.custom[i].items.length - 1].erkezik
        resp.custom[i].varhato_end = resp.custom[Number(i) + 1]?.items[0].varhato_erkezik || resp.custom[i].items[resp.custom[i].items.length - 1].varhato_erkezik
        if (resp.custom[i].varhato_end == resp.custom[i].end) { resp.custom[i].varhato_end = null }
    })
    return resp
}

export const runsDelay = async (runId: number) => {
    const body = {
        "func": "getRunsDelay",
        "params": {
            "runs": [
                runId
            ]
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const geoInfo = async (nativeData: any, fieldvalue: any, date: string) => {
    const body = {
        "query": "getGeomC",
        "datum": date,
        nativeData,
        fieldvalue
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const drawRuns = async (extent: Array<number>, max: number = 50) => {
    const body = {
        "query": "getRunsByExtent",
        "networks": allNetworks,
        "maxCount": max,
        "wgsExtent": extent
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const drawRunPath = async (runId: number) => {
    const body = {
        "query": "getRouteByRunId",
        "runId": runId,
        "datum": dateString(new Date())
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const drawStops = async (extent: Array<number>, max: number = 50, radius: number = 1500) => {
    const body = {
        "query": "getLsPsByExtentC",
        "datum": dateString(new Date()),
        "maxCount": max,
        "wgsExtent": extent,
        "wgslat": (extent[1] + extent[3]) / 2,
        "wgslon": (extent[0] + extent[2]) / 2,
        "radius": radius,
        "networks": allNetworks
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}