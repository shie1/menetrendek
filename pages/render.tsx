import { Avatar, Box, Center, Divider, Grid, Group, MantineProvider, Paper, Space, Stack, Text, ThemeIcon, Timeline } from "@mantine/core";
import { IconWalk, IconCheck, IconBus, IconWifi, IconAlertTriangle, IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";

const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

const ActionBullet = ({ muvelet }: { muvelet: string }) => {
    const size = 20
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            return <IconBus size={size} />
    }
}

const Render: NextPage = () => {
    const [results, setResults] = useState<any>()
    const [details, setDetails] = useState<any>()
    const [query, setQuery] = useState<any>()
    const router = useRouter()

    useEffect(() => {
        setQuery({
            from: Number(router.query['f'] as string),
            sFrom: Number(router.query['sf'] as string),
            to: Number(router.query['t'] as string),
            sTo: Number(router.query['st'] as string),
            hours: Number(router.query['h'] as string),
            minutes: Number(router.query['m'] as string),
            index: Number(router.query['i'] as string),
            date: router.query['d'] as string
        })
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp.results.talalatok[query.index]) } })
        }
    }, [query])

    useEffect(() => {
        if (results) {
            apiCall("POST", "/api/exposition", { fieldvalue: results.kifejtes_postjson, nativeData: results.nativeData, datestring: router.query['d'] as string }).then(setDetails)
        }
    }, [results])

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'grape',
        primaryShade: 8,
        fontFamily: 'Sora, sans-serif',
        fontSizes: {
            "sm": 20,
            "md": 22,
            "lg": 24,
            "xl": 26,
        }
    }}>
        <Center sx={{ zIndex: 89, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
            <Box id="renderBox" p="md" pb={0} sx={{ zIndex: 90, background: '#25262B', maxWidth: 600 }}>
                <Paper p="sm" radius="lg">
                    <Grid>
                        <Grid.Col sx={{ position: 'relative' }} span="auto">
                            {!results?.nativeData[0].FromBay ? <></> :
                                <Avatar variant="outline" m={10} radius="xl" size={30} sx={{ position: 'absolute', top: 0, left: 0 }}>{results.nativeData[0].FromBay}</Avatar>}
                            <Text align="center" size="xl">{results?.indulasi_ido}</Text>
                            <Text align="center" size="sm">{results?.departureCity}, {results?.departureStation}</Text>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <Text align="center" size="xl">{results?.erkezesi_ido}</Text>
                            <Text align="center" size="sm">{results?.arrivalCity}, {results?.arrivalStation}</Text>
                        </Grid.Col>
                    </Grid>
                    <Divider size="lg" my='sm' />
                    <Text align="center">{results?.atszallasok_szama} átszállás {results?.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color="#ffc400" /> : <></>}</Text>
                    <Group mb="lg" position="center" spacing='sm'>
                        <Text size="sm">{results?.osszido}</Text>
                        <Text size="sm">{currency.format(results?.totalFare)}</Text>
                        <Text size="sm">{results?.ossztav}</Text>
                    </Group>
                    <Timeline active={99}>
                        {!details ? <></> : Object.keys(details.results).map((i: any) => {
                            const dataItem = details.results[i]
                            return (<Timeline.Item bulletSize={25} key={i} title={dataItem.allomas} bullet={<ActionBullet muvelet={dataItem.muvelet} />} lineVariant={dataItem.muvelet === "átszállás" ? "dashed" : "solid"}>
                                <Stack spacing={0}>
                                    <Group align="center">
                                        <Text size="xl" mr={-4}>{dataItem.idopont}</Text>
                                        {!dataItem.jaratinfo ? <></> :
                                            !dataItem.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={25}>{dataItem.jaratinfo.FromBay}</Avatar>}
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
                                            <ThemeIcon size="lg" variant="light" radius="xl">
                                                <IconWifi size={25} />
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
                    {details ? <div id="done" /> : <></>}
                </Paper>
                <Group position="right" spacing={2}>
                    <IconLink size={12} />
                    <Text my={6} size={10}>menetrendek.shie1bi.hu</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

export default Render;