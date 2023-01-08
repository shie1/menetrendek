import type { NextPage } from "next"
import { useEffect } from "react"
import { showNotification } from "@mantine/notifications"
import { IconX } from "@tabler/icons"
import { LocalizedStrings } from "./api/localization"

const Page404: NextPage = (props: any) => {
    const strings: LocalizedStrings = props.strings
    useEffect(() => {
        showNotification({ title: strings.error, color: 'red', message: strings.pageNotFound, icon: <IconX />, id: '404-pagenotfound' })
    }, [])

    return (<></>)
}

export default Page404