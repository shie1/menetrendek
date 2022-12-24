import { Stop } from "./components/stops"
import { Query } from "./pages/_app"

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

export const parseKozlekedik = (kozlekedik: string) => {
    const date = /([MDCLXVI]+[.\-][0-9]+)(\-[A-ző]+)/

    const days = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"]
    const except = "kivéve"
    const workday = "munkanap"
    const nonwork = "munkaszünet"
    const before = "megelőző"
    const other = ["iskola", "nap", "és"]
    const keywords = [...days, except, workday, nonwork, before, ...other]
    const filterKeywords = () => {
        let res = []
        for (let word of kozlekedik.split(" ")) {
            if (word.match(date)) {
                res.push(word.match(date)![1].replace('-', '.'))
            }
            for (let kword of keywords) {
                if (word.includes(kword)) { res.push(kword) }
            }
        }
        return res
    }
    return filterKeywords()
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

export const routes = async (query: any) => {
    const rb: Query = query
    const date = new Date(rb.time.date)
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            "ext_settings": "block",
            "honnan_ls_id": rb.from!.ls_id,
            "honnan_settlement_id": rb.from!.s_id,
            "honnan_site_code": rb.from!.site_code,
            "hour": rb.time.hours || 0,
            "min": rb.time.minutes || 0,
            "hova_ls_id": rb.to!.ls_id,
            "hova_settlement_id": rb.to!.s_id,
            "hova_site_code": rb.to!.site_code,
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
            "lang": "hu",
            "dayPartText": "Egész nap",
            "orderText": "Indulási idő",
            "networks": allNetworks,
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const exposition = async (fieldvalue: any, nativeData: any, datestring: string) => {
    const body = {
        "debug": 0,
        "type": "",
        "query": "jarat_kifejtes_text_jsonC",
        "datum": datestring,
        "lang": "hu",
        "fieldvalue": fieldvalue,
        "nativeData": nativeData
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
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

export const map = async (extent: Array<number>, max: number = 50) => {
    const body = {
        "query": "getRunsByExtent",
        "networks": allNetworks,
        "maxCount": max,
        "wgsExtent": extent
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}