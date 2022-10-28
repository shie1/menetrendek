const api = "https://menetrendek.hu/menetrend/interface/index.php"

const networks = [0, 1, 10, 2, 13, 25]

export const dateString = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export const autocomplete = async (input: string) => {
    const date = new Date()
    const body = {
        "func": "getStationOrAddrByTextC",
        "params": {
            "inputText": input,
            "searchIn": [
                "stations"
            ],
            "searchDate": `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            "maxResults": 50,
            networks,
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const routes = async (query: any) => {
    const date = new Date(query.date)
    const { from, sFrom, to, sTo, maxTransfers, minTransferTime } = query
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            "ext_settings": "block",
            "honnan_ls_id": from,
            "honnan_settlement_id": sFrom,
            "honnan_site_code": "",
            "hour": date.getHours(),
            "min": date.getMinutes(),
            "hova_ls_id": to,
            "hova_settlement_id": sTo,
            "hova_site_code": "",
            "maxatszallas": maxTransfers,
            "maxwalk": 1000,
            "timeWindow": 0,
            "naptipus": 0,
            "odavissza": 0,
            "preferencia": 0,
            "rendezes": "1",
            "discountPercent": "0",
            "utirany": "oda",
            "var": minTransferTime,
            "lang": "hu",
            "dayPartText": "Egész nap",
            "orderText": "Indulási idő",
            networks,
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