const api = "https://menetrendek.hu/menetrend/interface/index.php"

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
            "maxResults": 20,
            "networks": [
                1,
                10,
                24
            ]
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}

export const routes = async (date: Date, from: number, sFrom: number, to: number, sTo: number) => {
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
            "maxatszallas": "5",
            "maxwalk": 1000,
            "timeWindow": 0,
            "naptipus": 0,
            "odavissza": 0,
            "preferencia": 0,
            "rendezes": "1",
            "discountPercent": "0",
            "utirany": "oda",
            "lang": "hu",
            "dayPartText": "Egész nap",
            "orderText": "Indulási idő",
            "networks": [
                1,
                10,
                24
            ],
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
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}