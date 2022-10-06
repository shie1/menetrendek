import { Accordion, ActionIcon, Avatar, Center, Collapse, CopyButton, Divider, Grid, Group, LoadingOverlay, Skeleton, Space, Stack, Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core";
import { useHash, useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconWalk, IconBus, IconCheck, IconWifi, IconShare, IconClipboard, IconDownload, IconInfoCircle, IconX } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { apiCall } from "../components/api";

const calcDisc = (fee: number, discount: number) => {
    return Math.abs(fee - ((fee / discount) * 100))
}

const downloadURI = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
}

const Query = createContext<any>({})
const LastPassedState = createContext<any>([])

const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

const ActionBullet = ({ muvelet }: { muvelet: string }) => {
    const size = 16
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            return <IconBus size={size} />
    }
}

const Route = ({ item, set, val, currOp }: { item: any, set: any, val: any, currOp: any }) => {
    const router = useRouter()
    const query = useContext(Query)
    const date = new Date(query.date)
    const now = new Date()
    const theme = useMantineTheme()
    const [data, setData] = useState<any>()
    const [open, setOpen] = useState<boolean>(false)
    const [discount, setDiscount] = useLocalStorage<number>({ key: 'discount-percentage', defaultValue: 0 })
    const start = item.indulasi_ido.split(":")
    const passed = (() => {
        if (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        ) {
            if (start[0] == query.hours) {
                return start[1] < query.minutes
            }
            return start[0] < query.hours
        } else {
            if (date.getFullYear() < now.getFullYear()) { return true }
            if (date.getMonth() < now.getMonth()) { return true }
            return date.getDate() < now.getDate()
        }
    })()
    const [lastPassed, setLastPassed] = useContext(LastPassedState)
    const [nextBus, setNextBus] = useState(false)

    useEffect(() => {
        if (lastPassed && !passed) {
            setNextBus(true)
        }
    }, [lastPassed])
    setLastPassed(passed)

    useEffect(() => {
        if (nextBus) {
            document.querySelector("#next-bus")?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [nextBus])

    useEffect(() => {
        if (currOp != val) { setOpen(false) }
    }, [currOp])

    return (<Accordion.Item id={nextBus ? 'next-bus' : ''} mb="md" value={val} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)', opacity: passed ? '60%' : '100%', transition: '.25s', '&:hover': { opacity: '100%' } })}>
        <Accordion.Control sx={{ padding: '16px', }} disabled={open && !data} onClick={() => {
            setOpen(!open)
            if (open) {
                set(0)
            } else {
                set(val)
            }
            if (!data) { apiCall("POST", "/api/exposition", { fieldvalue: item.kifejtes_postjson, nativeData: item.nativeData, datestring: router.query['d'] as string }).then((e) => { setData(e); if (open) set(val) }) }
        }}>
            <Stack spacing={0}>
                <Grid>
                    <Grid.Col sx={{ position: 'relative' }} span="auto">
                        {!item.nativeData[0].FromBay ? <></> :
                            <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, left: 0 }}>{item.nativeData[0].FromBay}</Avatar>}
                        <Text align="center" size="xl">{item.indulasi_ido}</Text>
                        <Text align="center" size="sm">{item.departureCity}, {item.departureStation}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                        <Text align="center" size="sm">{item.arrivalCity}, {item.arrivalStation}</Text>
                    </Grid.Col>
                </Grid>
                <Divider size="lg" my={6} />
                <Text align="center">{item.atszallasok_szama} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={theme.colorScheme === "dark" ? "#ffc400" : "#8c6c00"} /> : <></>}</Text>
                <Group position="center" spacing='sm'>
                    <Text size="sm">{item.osszido}</Text>
                    <Text size="sm">{currency.format(calcDisc(item.totalFare, discount))}</Text>
                    <Text size="sm">{item.ossztav}</Text>
                </Group>
            </Stack>
        </Accordion.Control>
        <Accordion.Panel>
            <Skeleton p="sm" visible={!data} sx={{ width: '100%' }} radius="lg">
                {!data ? <><Timeline>
                    {Array.from({ length: item.kifejtes_postjson.runcount * 2 }).map((i: any) => {
                        return <Timeline.Item title="Lorem" key={i}>
                            <Space h={50} />
                        </Timeline.Item>
                    })}
                </Timeline>
                    <Group position="right">
                        <ActionIcon>
                            <IconDownload />
                        </ActionIcon>
                    </Group>
                </>
                    :
                    <><Timeline active={99}>
                        {Object.keys(data.results).map((i: any) => {
                            const dataItem = data.results[i]
                            return (<Timeline.Item key={i} title={dataItem.allomas} bullet={<ActionBullet muvelet={dataItem.muvelet} />} lineVariant={dataItem.muvelet === "átszállás" ? "dashed" : "solid"}>
                                <Stack spacing={0}>
                                    <Group align="center">
                                        <Text size="xl" mr={-4}>{dataItem.idopont}</Text>
                                        {!dataItem.jaratinfo ? <></> :
                                            !dataItem.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={24}>{dataItem.jaratinfo.FromBay}</Avatar>}
                                    </Group>
                                    {!dataItem.jaratinfo ? <></> : <>
                                        <Group position="right">
                                            <ActionIcon sx={{ position: 'absolute' }} onClick={() => router.push(`/runs?id=${dataItem.runId}&s=${dataItem.jaratinfo.StartStation}&e=${dataItem.jaratinfo.EndStation}&d=${router.query['d']}`)}>
                                                <IconInfoCircle />
                                            </ActionIcon>
                                        </Group>
                                        <Group spacing={10}>
                                            {!dataItem.jaratinfo.fare ? <></> :
                                                <Text size="sm">{currency.format(calcDisc(dataItem.jaratinfo.fare, discount))}</Text>}
                                            {!dataItem.jaratinfo.travelTime ? <></> :
                                                <Text size="sm">{dataItem.jaratinfo.travelTime} perc</Text>}
                                            {!dataItem.jaratszam ? <></> :
                                                <Text size="sm">{dataItem.jaratszam}</Text>}
                                        </Group>
                                        {!dataItem.vegallomasok ? <></> :
                                            <Text size="sm">{dataItem.vegallomasok}</Text>}
                                        {!dataItem.jaratinfo.kozlekedik ? <></> :
                                            <Text size="sm">Közlekedik: {dataItem.jaratinfo.kozlekedik}</Text>}
                                        <Space h={2} />
                                        {!dataItem.jaratinfo.wifi ? <></> :
                                            <ThemeIcon variant="light" radius="xl">
                                                <IconWifi size={20} />
                                            </ThemeIcon>
                                        }
                                    </>}
                                    {!dataItem.TimeForChange ? <></> :
                                        <Text size="sm">Idő az átszállásra: {dataItem.TimeForChange} perc</Text>}
                                    {dataItem.muvelet !== "leszállás" ? <Space h="md" /> : <></>}
                                </Stack>
                            </Timeline.Item>)
                        })}
                    </Timeline>
                        <Group position="right">
                            <ActionIcon onClick={() => downloadURI(`https://menetrendek.shie1bi.hu/api/render?${router.asPath.split('?')[1]}&h=${query.hours}&m=${query.minutes}&i=${val}`, `screenshot-${Date.now()}`)}>
                                <IconDownload />
                            </ActionIcon>
                        </Group>
                    </>}
            </Skeleton>
        </Accordion.Panel>
    </Accordion.Item>)
}

const Routes: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [accordion, setAccordion] = useState<any>()
    const [lastPassed, setLastPassed] = useState<any>(true)
    const date = new Date()

    useEffect(() => {
        setLoading(true)
        if (router.query['f']) {
            setQuery({
                from: Number(router.query['f'] as string),
                sFrom: Number(router.query['sf'] as string),
                to: Number(router.query['t'] as string),
                sTo: Number(router.query['st'] as string),
                hours: router.query['h'] ? Number(router.query['h'] as string) : date.getHours(),
                minutes: router.query['m'] ? Number(router.query['h'] as string) : date.getMinutes(),
                date: router.query['d'] as string
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp); setLoading(false) } else { router.push('/'); showNotification({ title: 'Nincs járat!', message: 'Nem találtunk egy jártatot sem a keresés alapján!', color: 'red', icon: <IconX /> }) } })
        }
    }, [query])

    return (<>
        <Query.Provider value={query}>
            <LastPassedState.Provider value={[lastPassed, setLastPassed]}>
                <LoadingOverlay visible={loading} />
                <Accordion value={accordion} chevron={<></>} chevronSize={0} radius="lg" variant="filled" >
                    {results ?
                        Object.keys(results.results.talalatok).map(key => {
                            const item = results.results.talalatok[key]
                            return (<Route set={setAccordion} currOp={accordion} val={key} key={key} item={item} />)
                        }
                        ) : <></>}
                </Accordion>
            </LastPassedState.Provider>
        </Query.Provider>
    </>)
}

export default Routes