import { Accordion, ActionIcon, Avatar, Center, Collapse, CopyButton, Divider, Grid, Group, LoadingOverlay, Skeleton, Space, Stack, Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core";
import { useHash } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconWalk, IconBus, IconCheck, IconWifi, IconShare, IconClipboard } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";

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
    const theme = useMantineTheme()
    const [data, setData] = useState<any>()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if (currOp != val) { setOpen(false) }
    }, [currOp])

    return (<a id={`j${val}`}><Accordion.Item mb="md" value={val} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)' })}>
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
                        <Text align="center" size="sm">{item.indulasi_hely}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                        <Text align="center" size="sm">{item.erkezesi_hely}</Text>
                    </Grid.Col>
                </Grid>
                <Divider size="lg" my={6} />
                <Text align="center">{item.atszallasok_szama} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={theme.colorScheme === "dark" ? "#ffc400" : "#8c6c00"} /> : <></>}</Text>
                <Group position="center" spacing='sm'>
                    <Text size="sm">{item.osszido}</Text>
                    <Text size="sm">{currency.format(item.totalFare)}</Text>
                    <Text size="sm">{item.ossztav}</Text>
                </Group>
            </Stack>
        </Accordion.Control>
        <Accordion.Panel>
            <Skeleton p="sm" visible={!data} sx={{ width: '100%' }} radius="lg">
                {!data ? <Timeline>
                    {Array.from({ length: item.kifejtes_postjson.runcount * 2 }).map((i: any) => {
                        return <Timeline.Item title="Lorem" key={i}>
                            <Space h={50} />
                        </Timeline.Item>
                    })}
                </Timeline> :
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
                                        <Group spacing={10}>
                                            {!dataItem.jaratinfo.fare ? <></> :
                                                <Text size="sm">{currency.format(dataItem.jaratinfo.fare)}</Text>}
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
                            <CopyButton value={`https://menetrendek.shie1bi.hu${router.asPath.replace(/\#(.*)/g, '')}#j${val}`}>
                                {({ copied, copy }) => (
                                    <ActionIcon onClick={() => {
                                        copy()
                                        showNotification({ id: `copied-${val}`, title: 'Vágolapra másolva!', message: 'A megosztási URL másolva lett a vágolapra!', icon: <IconClipboard /> })
                                    }} sx={{ marginTop: '-5%' }} variant="transparent" radius="xl">
                                        <IconShare />
                                    </ActionIcon>
                                )}
                            </CopyButton>
                        </Group>
                    </>}
            </Skeleton>
        </Accordion.Panel>
    </Accordion.Item></a>)
}

const Routes: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [accordion, setAccordion] = useState<any>()

    useEffect(() => {
        setLoading(true)
        setQuery({
            from: Number(router.query['f'] as string),
            to: Number(router.query['t'] as string),
            hours: Number(router.query['h'] as string),
            minutes: Number(router.query['m'] as string),
            date: router.query['d'] as string
        })
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp); setLoading(false) } })
        }
    }, [query])

    return (<>
        <Head>
            <title>Menetrendek</title>
        </Head>
        <LoadingOverlay visible={loading} />
        <Accordion value={accordion} chevron={<></>} chevronSize={0} radius="lg" variant="filled" >
            {results ?
                Object.keys(results.results.talalatok).map(key => {
                    const item = results.results.talalatok[key]
                    return (<Route set={setAccordion} currOp={accordion} val={key} key={key} item={item} />)
                }
                ) : <></>}
        </Accordion>
    </>)
}

export default Routes