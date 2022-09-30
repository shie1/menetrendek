export const apiCall = async (method: "GET" | "POST", url: string, body?: any) => {
    switch (method) {
        case 'GET':
            return await (await fetch(`${url}?${body ? (new URLSearchParams(body)).toString() : ''}`)).json()
        case 'POST':
            return await (await fetch(url, { method: "POST", body: body ? JSON.stringify(body) : '' })).json()
    }
}