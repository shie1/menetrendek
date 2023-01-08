import { Group, Button, Stack, Text, useMantineTheme, LoadingOverlay } from "@mantine/core";
import { IconAlertCircle, IconSearch } from "@tabler/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { Stop, StopInput } from "./stops";
import { useRouter } from "next/router"
import { apiCall } from "./api"
import { useCookies } from "react-cookie"
import { dateString } from "../client"
import { Input } from "../pages/_app";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { motion } from "framer-motion"
import { LocalizedStrings } from "../pages/api/localization";

export const QuickMenu = ({ strings }: { strings: LocalizedStrings }) => {
    const { selection, setSelection, input } = useContext(Input)
    const [from, setFrom] = [selection ? selection.from as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, from: e }) }]
    const [to, setTo] = [selection ? selection.to as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, to: e }) }]
    const [from_input, to_input] = [input.from, input.to]
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'nerf-mode']);
    const [date, setDate] = useState<Date | null>(null)
    const [time, setTime] = useState<Date | null>(null)
    const [searchHref, setSearchHref] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const theme = useMantineTheme()
    const router = useRouter()

    useEffect(() => {
        if (searchHref) router.prefetch(searchHref)
    }, [searchHref])

    const generateUrl = useCallback(async () => {
        const map = (arr: Array<any>) => (arr.map(item => ({ value: item.lsname, ls_id: item.ls_id, s_id: item.settlement_id, site_code: item.site_code, network: item.network_id })))
        let sfrom = from; let sto = to
        if (!sfrom) {
            sfrom = map((await apiCall("POST", "/api/autocomplete", { 'input': from_input, 'networks': cookies["selected-networks"] })).results)[0]
        }
        if (!sto) {
            sto = map((await apiCall("POST", "/api/autocomplete", { 'input': to_input, 'networks': cookies["selected-networks"] })).results)[0]
        }
        if (!sfrom || !sto) { setSearchHref(undefined); return }
        setSearchHref(`/routes?${(new URLSearchParams({
            ...(sfrom!.ls_id ? { fl: sfrom!.ls_id.toString() } : {}),
            fs: sfrom!.s_id.toString(),
            ...(sfrom!.site_code ? { fc: sfrom!.site_code } : {}),
            ...(sto!.ls_id ? { tl: sto!.ls_id.toString() } : {}),
            ts: sto!.s_id.toString(),
            ...(sto!.site_code ? { tc: sto!.site_code } : {}),
            ...(time ? { h: time.getHours().toString(), m: time.getMinutes().toString() } : {}),
            ...(date ? dateString(date) === dateString(new Date()) ? {} : { d: dateString(date) } : {})
        })).toString()}`)
    }, [from, to, from_input, to_input, date, time])

    useEffect(() => {
        generateUrl()
    }, [from, to, from_input, to_input, date, time])

    return (<Stack mb="md">
        <Text size={30} weight={500}>{strings.search}</Text>
        <Text mt={-20} color="dimmed" size={15} weight={500}>{strings.searchSlogan}</Text>
        <motion.div transition={{ duration: .2 }} animate={{ margin: !loading ? 0 : '-10px -10px', padding: !loading ? 0 : '10px 10px' }} style={{ position: 'relative' }}>
            <Group sx={{ display: 'flex', flexWrap: "wrap", '& > *': { flex: 8 }, '& .searchInput': { minWidth: '16rem', } }}>
                <LoadingOverlay transitionDuration={200} radius="md" visible={loading} />
                <StopInput strings={strings} variant="from" />
                <StopInput strings={strings} variant="to" />
                <DatePicker transition="scale-y" transitionDuration={200} styles={(theme) => ({ dropdown: { borderRadius: theme.radius.md, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, input: { fontSize: 16, border: 'unset', background: 'transparent' }, wrapper: { width: '100%', height: 36 }, root: { borderBottom: '3px solid #373A40', height: 45, display: 'flex', alignItems: 'center', } })} className="searchInput" value={date || new Date()} clearable={false} onChange={setDate} />
                <Button variant="gradient" onClick={(e) => {
                    e.preventDefault()
                    if (searchHref) {
                        setLoading(true)
                        router.push(searchHref).then(() => setLoading(false))
                    } else {
                        showNotification({ title: strings.errorEmptyFields, message: strings.errorEmptyFieldsSubtext, icon: <IconAlertCircle />, color: "red", id: "error-empty-fields" })
                    }
                }} role="button" component="a" aria-label={strings.searchRoutes} href={searchHref || "#"} gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }} sx={{ flex: 4, minWidth: '15rem' }} leftIcon={<IconSearch />}>{strings.search}</Button>
            </Group>
        </motion.div>
    </Stack>)
}