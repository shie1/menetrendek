export const getHost = (req: any) => {
    const host = req ? "http://" + req.headers.host : typeof window !== 'undefined' ? window.location.origin : ""
    return host
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