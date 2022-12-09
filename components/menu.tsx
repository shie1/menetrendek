import { Group, Button, Stack, Text } from "@mantine/core"
import { IconSearch } from "@tabler/icons"
import { useState } from "react"
import { Stop, StopInput } from "./stops"
import { useRouter } from "next/router"
import { apiCall } from "./api"
import { useCookies } from "react-cookie"
import { dateString } from "../client"

export const QuickMenu = () => {
    const [from, setFrom] = useState<Stop>()
    const [to, setTo] = useState<Stop>()
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
    const [date, setDate] = useState<Date | null>(null)
    const [time, setTime] = useState<Date | null>(null)
    const router = useRouter()

    const search = async () => {
        const get = (variant: "from" | "to") => document.querySelector("#stopinput-" + variant) as HTMLInputElement
        const map = (arr: Array<any>) => (arr.map(item => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
        let sfrom = from; let sto = to
        if (!sfrom) {
            sfrom = map((await apiCall("POST", "/api/autocomplete", { 'input': get("from").value, 'networks': cookies["selected-networks"] })).results)[0]
        }
        if (!to) {
            sto = map((await apiCall("POST", "/api/autocomplete", { 'input': get("to").value, 'networks': cookies["selected-networks"] })).results)[0]
        }
        router.push(`/routes?${(new URLSearchParams({
            ...(sfrom!.ls_id ? { fl: sfrom!.ls_id.toString() } : {}),
            fs: sfrom!.s_id.toString(),
            ...(sfrom!.site_code ? { fc: sfrom!.site_code } : {}),
            ...(sto!.ls_id ? { tl: sto!.ls_id.toString() } : {}),
            ts: sto!.s_id.toString(),
            ...(sto!.site_code ? { tc: sto!.site_code } : {}),
            ...(time ? { h: time.getHours().toString(), m: time.getMinutes().toString() } : {}),
            ...(date ? { d: dateString(date) } : {})
        })).toString()}`)
    }

    return (<Stack mb="md">
        <Text size={30} weight={500}>Keresés</Text>
        <Text mt={-20} color="dimmed" size={15} weight={500}>A hasznos utitárs, aki végig kísér.</Text>
        <Group sx={{ display: 'flex', flexWrap: "wrap", '& *': { flex: 8 } }}>
            <StopInput selection={{ selected: from, setSelected: setFrom }} variant="from" />
            <StopInput selection={{ selected: to, setSelected: setTo }} variant="to" />
            <Button onClick={search} sx={{ flex: 4, minWidth: '15rem' }} leftIcon={<IconSearch />}>Keresés</Button>
        </Group>
    </Stack>)
}