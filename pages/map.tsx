import { showNotification } from "@mantine/notifications";
import { IconHourglass } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Map: NextPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.push("/")
        showNotification({ title: "Sajnáljuk!", message: "Ez a funkció még nem elérhető.", color: "yellow", id: "feature-not-available", icon: <IconHourglass /> })
    }, [])

    return (<></>)
}

export default Map;