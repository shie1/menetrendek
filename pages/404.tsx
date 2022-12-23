import type { NextPage } from "next"
import { useEffect } from "react"
import { showNotification } from "@mantine/notifications"
import { IconX } from "@tabler/icons"

const Page404: NextPage = () => {
    useEffect(() => {
        showNotification({ title: "Hiba!", color: 'red', message: "A keresett aloldal nem található!", icon: <IconX />, id: '404-pagenotfound' })
    }, [])

    return (<></>)
}

export default Page404