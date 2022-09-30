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

export const routes = async (date: Date, from: number, to: number) => {
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            "ext_settings": "block",
            "honnan_ls_id": 0,
            "honnan_settlement_id": from,
            "honnan_site_code": "",
            "hour": date.getHours(),
            "min": date.getMinutes(),
            "hova_ls_id": 0,
            "hova_settlement_id": to,
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
    console.log(body)
    return await (await fetch(api, { method: "POST", body: JSON.stringify(body) })).json()
}