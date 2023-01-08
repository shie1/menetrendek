export const getHost = (req: any) => {
    return req ? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://" + req.headers.host) : ""
}

export const apiCall = async (method: "GET" | "POST", url: string, body?: any) => {
    try {
        switch (method) {
            case 'GET':
                return await (await fetch(`${url}?${body ? (new URLSearchParams(body)).toString() : ''}`)).json()
            case 'POST':
                return await (await fetch(url, { method: "POST", body: body ? JSON.stringify(body) : '' })).json()
        }
    } catch {
        return undefined
    }
}