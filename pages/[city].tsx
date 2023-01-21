import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { PageHeading } from "../components/page"
import { Image } from "@mantine/core"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { showNotification } from "@mantine/notifications"
import { IconBandage } from "@tabler/icons"

const City: NextPage = (props: any) => {
    const router = useRouter()
    useEffect(() => {
        if (!props.city) {
            router.push("/")
            showNotification({ title: "Hiba!", message: "404 • Az oldal nem található!", color: "red", id: "page-not-found", icon: <IconBandage /> })
        }
    }, [props.city])

    if (!props.city) return (<></>)
    return (<>
        <div className='bg' style={{ backgroundImage: `url("${props.city.image}")` }} />
        <PageHeading title={props.city.name} subtitle={`Magyar település ${props.city.county} megyében`} />
    </>)
}

City.getInitialProps = async (ctx: any) => {
    try {
        return {
            city: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/cities/${ctx.query.city}`)
        }
    } catch (e) {
        return {
            city: null
        }
    }
}

export default City