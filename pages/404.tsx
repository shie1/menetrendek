import { showNotification } from '@mantine/notifications'
import { IconBandage } from '@tabler/icons'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Page404: NextPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.push("/")
        showNotification({ title: "Hiba!", message: "404 • Az oldal nem található!", color: "red", id: "page-not-found", icon: <IconBandage /> })
    }, [])

    return (<></>)
}

export default Page404