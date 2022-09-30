const api = "https://menetrendek.hu/menetrend/interface/index.php"

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

export const routes = async (date: Date) => {
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            "erk_stype": "megallo",
            "ext_settings": "block",
            "honnan": "Székesfehérvár",
            "honnan_ls_id": 0,
            "honnan_settlement_id": 1482,
            "honnan_site_code": "",
            "hour": date.getHours(),
            "min": date.getMinutes(),
            "hova": "Előszállás",
            "hova_ls_id": 0,
            "hova_settlement_id": 2035,
            "hova_site_code": "",
            "ind_stype": "megallo",
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
        }
    }
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}