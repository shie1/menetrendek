import { Group, Button, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useContext, useState } from "react";
import { Stop, StopInput } from "./stops";
import { useRouter } from "next/router"
import { apiCall } from "./api"
import { useCookies } from "react-cookie"
import { dateString } from "../client"
import { Input } from "../pages/_app";
import { useUserAgent } from "./ua";
import { DatePicker } from "@mantine/dates";

export const QuickMenu = () => {
    const { selection, setSelection } = useContext(Input)
    const [from, setFrom] = [selection ? selection.from as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, from: e }) }]
    const [to, setTo] = [selection ? selection.to as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, to: e }) }]
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'nerf-mode']);
    const [date, setDate] = useState<Date | null>(null)
    const [time, setTime] = useState<Date | null>(null)
    const ua = useUserAgent()
    const theme = useMantineTheme()
    const router = useRouter()

    const search = async () => {
        const get = (variant: "from" | "to") => document.querySelector("#stopinput-" + variant) as HTMLInputElement
        const map = (arr: Array<any>) => (arr.map(item => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
        let sfrom = from; let sto = to
        if (!sfrom) {
            sfrom = map((await apiCall("POST", "/api/autocomplete", { 'input': get("from").value, 'networks': cookies["selected-networks"] })).results)[0]
        }
        if (!sto) {
            sto = map((await apiCall("POST", "/api/autocomplete", { 'input': get("to").value, 'networks': cookies["selected-networks"] })).results)[0]
        }
        if (!sfrom || !sto) { return }
        router.push(`/routes?${(new URLSearchParams({
            ...(sfrom!.ls_id ? { fl: sfrom!.ls_id.toString() } : {}),
            fs: sfrom!.s_id.toString(),
            ...(sfrom!.site_code ? { fc: sfrom!.site_code } : {}),
            ...(sto!.ls_id ? { tl: sto!.ls_id.toString() } : {}),
            ts: sto!.s_id.toString(),
            ...(sto!.site_code ? { tc: sto!.site_code } : {}),
            ...(time ? { h: time.getHours().toString(), m: time.getMinutes().toString() } : {}),
            ...(date ? dateString(date) === dateString(new Date()) ? {} : { d: dateString(date) } : {})
        })).toString()}`)
    }

    return (<Stack mb="md">
        <Text size={30} weight={500}>Keresés</Text>
        <Text mt={-20} color="dimmed" size={15} weight={500}>A hasznos útitárs, aki végig kísér.</Text>
        <Group sx={{ display: 'flex', flexWrap: "wrap", '& > *': { flex: 8 }, '& .searchInput': { minWidth: '16rem', } }}>
            <StopInput variant="from" />
            <StopInput variant="to" />
            <DatePicker styles={{ wrapper: { zIndex: -1 }, root: { '&:hover': { zIndex: 1 } } }} transition="scale-y" transitionDuration={200} sx={(theme) => ({ '& .mantine-DatePicker-dropdown': { borderRadius: theme.radius.md, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, display: 'flex', alignItems: 'center', input: { fontSize: 16, border: 'unset', background: 'transparent' }, borderBottom: '3px solid #373A40', minHeight: 45 })} className="searchInput" value={date || new Date()} clearable={false} onChange={setDate} />
            <Button style={{ zIndex: -1 }} variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }} onClick={search} sx={{ flex: 4, minWidth: '15rem' }} leftIcon={<IconSearch />}>Keresés</Button>
        </Group>
    </Stack>)
}