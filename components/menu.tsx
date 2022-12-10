import { Group, Button, Stack, Text, useMantineTheme, Paper, Menu, ScrollArea, ActionIcon } from "@mantine/core"
import { IconAlertCircle, IconArrowBarRight, IconArrowBarToRight, IconChevronDown, IconSearch, IconX } from "@tabler/icons"
import { useContext, useState } from "react"
import { Stop, StopIcon, StopInput } from "./stops"
import { useRouter } from "next/router"
import { apiCall } from "./api"
import { useCookies } from "react-cookie"
import { dateString } from "../client"
import { useLocalStorage, useMediaQuery } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { interactive } from "./styles"
import { motion } from "framer-motion"

const QuickStop = ({ value, network, ls_id, s_id, site_code }: Stop) => {
    const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")

    return (<Menu trigger='click' shadow="md" radius="md" transition='rotate-right' position='bottom-start' closeOnClickOutside closeOnItemClick closeOnEscape>
        <Menu.Target>
            <Paper style={{ userSelect: 'none' }} sx={interactive} p='md' radius="lg" shadow="md">
                <Group noWrap position='apart'>
                    <Group spacing='sm' noWrap>
                        <StopIcon network={network!} />
                        <Text style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} size='md'>{value}</Text>
                    </Group>
                </Group>
            </Paper>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Label>{value}</Menu.Label>
            <Menu.Item icon={<IconArrowBarRight size={14} />}>Indulás innen</Menu.Item>
            <Menu.Item icon={<IconArrowBarToRight size={14} />}>Érkezés ide</Menu.Item>
            <Menu.Item color='red' icon={<IconX size={14} />}>Eltávolítás</Menu.Item>
        </Menu.Dropdown>
    </Menu>)
}

export const QuickMenu = () => {
    const [from, setFrom] = useState<Stop>()
    const [to, setTo] = useState<Stop>()
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
    const [date, setDate] = useState<Date | null>(null)
    const [time, setTime] = useState<Date | null>(null)
    const [stops, setStops] = useLocalStorage({ key: 'frequent-stops', defaultValue: [] })
    const [stopsOpen, setStopsOpen] = useState(false)
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
            ...(date ? { d: dateString(date) } : {})
        })).toString()}`)
    }

    return (<Stack mb="md">
        <Text size={30} weight={500}>Keresés</Text>
        <Text mt={-20} color="dimmed" size={15} weight={500}>A hasznos utitárs, aki végig kísér.</Text>
        <Group sx={{ display: 'flex', flexWrap: "wrap", '& *': { flex: 8 } }}>
            <StopInput selection={{ selected: from, setSelected: setFrom }} variant="from" />
            <StopInput selection={{ selected: to, setSelected: setTo }} variant="to" />
            <Button variant="gradient" gradient={{ from: theme.colors[theme.primaryColor][theme.primaryShade as any], to: theme.colors["cyan"][theme.primaryShade as any] }} onClick={search} sx={{ flex: 4, minWidth: '15rem' }} leftIcon={<IconSearch />}>Keresés</Button>
        </Group>
        <Group position="center" my={-15}>
            <motion.div animate={{ rotateX: stopsOpen ? -180 : 0, }}>
                <ActionIcon variant="transparent" size="md" onClick={() => setStopsOpen(!stopsOpen)}>
                    <IconChevronDown size={30} />
                </ActionIcon>
            </motion.div>
        </Group>
        <motion.div style={{overflow: 'hidden'}} animate={{ height: stopsOpen ? 'initial' : 0 }}>
            <Paper shadow="lg" p={2} radius="lg">
                <ScrollArea style={{ overflow: 'visible' }} type="auto" offsetScrollbars>
                    <Group style={{ overflow: 'visible' }} noWrap>
                        {stops.map((stop: Stop, i: any) => {
                            return (<motion.div key={i} layout layoutDependency={stops}>
                                <QuickStop {...stop} />
                            </motion.div>)
                        })}
                    </Group>
                </ScrollArea>
            </Paper>
        </motion.div>
    </Stack>)
}