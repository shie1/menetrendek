import { useEffect, useState } from "react"

export const useGeoLocation = () => {
    const [geo, setGeo] = useState<null | GeolocationPosition>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            navigator.geolocation.watchPosition((e) => setGeo(e), null, { enableHighAccuracy: true })
        }
        return () => { }
    }, [])

    return geo
}