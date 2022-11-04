import {
    ActionIcon,
    Button,
    Center,
    Grid,
    Group,
    List,
    Menu,
    Paper,
    ScrollArea,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates"
import { useLocalStorage, useMediaQuery } from "@mantine/hooks"
import { IconRefresh, IconClock, IconArrowForwardUp, IconApps, IconInfoCircle, IconLayout2, IconMoonStars, IconRotateClockwise2, IconSearch, IconSettings, IconShare, IconAlertCircle, IconArrowBarRight, IconArrowBarToRight, IconX } from "@tabler/icons"
import { createElement, useContext, useEffect, useState } from "react";
import { StopIcon, StopInput } from "./stops"
import { gradientText, interactive } from "./styles"
import type { Stop } from "../components/stops"
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { apiCall } from "./api";
import { useCookies } from "react-cookie";
import { dateString } from "../client";
import { motion } from "framer-motion"
import { showNotification } from "@mantine/notifications";
import { isEqual } from "lodash";
import { Input } from "../pages/_app";

const QuickStop = ({ value, network, ls_id, s_id, site_code, remove }: Stop & { remove: any }) => {
    const [input, setInput] = useContext<any>(Input)
    const [from, setFrom] = [input ? input.from as Stop : undefined, (e: Stop) => { setInput({ ...input, from: e }) }]
    const [to, setTo] = [input ? input.to as Stop : undefined, (e: Stop) => { setInput({ ...input, to: e }) }]
    const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")

    if (typeof network === 'undefined') { // Migration from type to networks
        remove()
        showNotification({ id: 'deprecated-stops', title: 'Előzmények törölve!', color: 'grape', message: 'Az előzményeid törölve lettek, mert elavultak egy frissítés óta!', icon: <IconAlertCircle /> })
    }

    const set = (setter: any) => {
        setter({ value, network, ls_id, s_id, site_code })
    }

    return (<Menu trigger='click' shadow="md" radius="md" transition='rotate-right' position='bottom-start' closeOnClickOutside closeOnItemClick closeOnEscape>
        <Menu.Target>
            <Paper style={{ userSelect: 'none' }} sx={interactive} p='md' radius="lg" shadow="md">
                <Group position='apart'>
                    <Group spacing='sm' noWrap>
                        <StopIcon network={network!} />
                        <Text size='md'>{value}</Text>
                    </Group>
                </Group>
            </Paper>
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Label>{value}</Menu.Label>
            <Menu.Item onClick={() => set(setFrom)} icon={<IconArrowBarRight size={14} />}>Indulás innen</Menu.Item>
            <Menu.Item onClick={() => set(setTo)} icon={<IconArrowBarToRight size={14} />}>Érkezés ide</Menu.Item>
            <Menu.Item onClick={remove} color='red' icon={<IconX size={14} />}>Eltávolítás</Menu.Item>
        </Menu.Dropdown>
    </Menu>)
}

export const SearchSection = () => {
    const [input, setInput] = useContext<any>(Input)
    const [from, setFrom] = [input ? input.from as Stop : undefined, (e: Stop) => { setInput({ ...input, from: e }) }]
    const [to, setTo] = [input ? input.to as Stop : undefined, (e: Stop) => { setInput({ ...input, to: e }) }]
    const [date, setDate] = useState<Date | null>(null)
    const [time, setTime] = useState<Date | null>(null)
    const theme = useMantineTheme()
    const router = useRouter()
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);

    const search = async () => {
        let sfrom = from; let sto = to
        if (typeof from === 'string' || typeof to === 'string') {
            if (typeof from === 'string') {
                sfrom = await apiCall("POST", "/api/autocomplete", { 'input': from, 'networks': cookies["selected-networks"] })
                setFrom(sfrom!)
            }
            if (typeof to === 'string') {
                sto = await apiCall("POST", "/api/autocomplete", { 'input': from, 'networks': cookies["selected-networks"] })
                setTo(sto!)
            }
        }
        router.push(`/routes?${(new URLSearchParams({
            fl: from!.ls_id.toString(),
            fs: from!.s_id.toString(),
            ...(from!.site_code ? { fc: from!.site_code } : {}),
            tl: to!.ls_id.toString(),
            ts: to!.s_id.toString(),
            ...(to!.site_code ? { tc: to!.site_code } : {}),
            ...(time ? { h: time.getHours().toString(), m: time.getMinutes().toString() } : {}),
            ...(date ? { d: dateString(date) } : {})
        })).toString()}`)
    }

    return (<Stack>
        <StopInput selection={[from, setFrom]} variant='from' />
        <StopInput selection={[to, setTo]} variant='to' />
        <Grid sx={{ width: '100%' }}>
            <Grid.Col span="auto">
                <DatePicker clearable={false} sx={{ input: { border: '1px solid #7c838a' } }} radius='xl' onChange={setDate} value={date || new Date()} />
            </Grid.Col>
            <Grid.Col span="content">
                <TimeInput sx={{ '& .mantine-Input-input.mantine-TimeInput-input': { border: '1px solid #7c838a !important' } }} radius='xl' onChange={setTime} value={time || new Date()} />
            </Grid.Col>
            <Grid.Col span="content">
                <ActionIcon sx={{ border: '1px solid #7c838a' }} onClick={() => {
                    setDate(null)
                    setTime(null)
                }} variant='default' size="lg" radius="xl">
                    <IconClock size={18} />
                </ActionIcon>
            </Grid.Col>
        </Grid>
        <Button onClick={search} leftIcon={<IconArrowForwardUp size={22} />} variant="gradient" gradient={{ from: theme.primaryColor, to: 'blue' }} radius="xl">Tovább</Button>
    </Stack>)
}

const DiscountSelector = dynamic(() =>
    import('../components/selectors').then((e) => e.DiscountSelector),
    { ssr: false }
)
const NetworksSelector = dynamic(() =>
    import('../components/selectors').then((e) => e.NetworksSelector),
    { ssr: false }
)
const MyThemeIcon = ({ icon }: { icon: any }) => {
    const theme = useMantineTheme()
    return <ThemeIcon radius="xl" variant="gradient" gradient={{ from: theme.primaryColor, to: 'blue' }}>{createElement(icon, { size: 20 })}</ThemeIcon>
}
export const QuickMenu = () => {
    const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
    const width = useMediaQuery('(min-width: 560px)')
    const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")
    const theme = useMantineTheme()
    const [tab, setTab] = useState<any>("introduction")

    useEffect(() => {
        if (stops.length !== 0) setTab("stops")
    }, [stops])

    return (<Tabs onTabChange={setTab} sx={{ height: '100%', '& .mantine-Tabs-tabLabel': { fontSize: touchscreen ? theme.fontSizes.sm * 1.1 : theme.fontSizes.sm } }} variant="outline" radius="md" defaultValue="stops" value={tab}>
        <Tabs.List>
            <Tabs.Tab value="introduction" icon={<IconInfoCircle size={14} />}>Információ</Tabs.Tab>
            <Tabs.Tab value="stops" icon={<IconRotateClockwise2 size={14} />}>Gyors elérés</Tabs.Tab>
            <Tabs.Tab value="options" icon={<IconSettings size={14} />}>Preferenciák</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="introduction">
            <Stack spacing="sm" p="sm">
                <Stack spacing={2}>
                    <Title sx={gradientText} size={25}>Modern menetrend kereső</Title>
                    <Title order={2} size={15}>MÁV, Volánbusz, BKK, GYSEV, MAHART, BAHART</Title>
                </Stack>
                <List spacing={6}>
                    <List.Item icon={<MyThemeIcon icon={IconLayout2} />}>Korszerű, letisztult és mobilbarát kezelőfelület.</List.Item>
                    <List.Item icon={<MyThemeIcon icon={IconMoonStars} />}>Sötét és világos mód támogatás.</List.Item>
                    <List.Item icon={<MyThemeIcon icon={IconSearch} />}>Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe.</List.Item>
                    <List.Item icon={<MyThemeIcon icon={IconShare} />}>Útvonaltervek gyors megosztása.</List.Item>
                    <List.Item icon={<MyThemeIcon icon={IconApps} />}>PWA (Progressive Web App) támogatás.</List.Item>
                </List>
            </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="options" pt="xs">
            <Stack spacing='sm' style={{ margin: '0 auto', maxWidth: width ? '80%' : '100%' }}>
                <DiscountSelector />
                <NetworksSelector />
            </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="stops" pt="xs">
            <Center>
                {stops.length === 0 ? <Text size='sm' style={{ opacity: .8 }} align='center'>Itt fognak megjellenni a legutóbbi megállóid...</Text> :
                    <Group position="center" align="center" spacing={6}>
                        {stops.map((stop: Stop, i: any) => {
                            return (<motion.div layout layoutDependency={stops}>
                                <QuickStop {...stop} key={i} remove={() => setStops(stops.filter(fStop => !isEqual(fStop, stop)))} />
                            </motion.div>)
                        })}
                    </Group>
                }
            </Center>
        </Tabs.Panel>
    </Tabs>)
}