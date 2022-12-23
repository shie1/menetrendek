import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { dateString } from "../client";
import { apiCall } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";
import { Stop } from "../components/stops";

const Render: NextPage = () => {
    const [results, setResults] = useState<any>()
    const [details, setDetails] = useState<any>()
    const [done, setDone] = useState(false)
    const [query, setQuery] = useState<any>()
    const router = useRouter()
    const date = new Date()

    useEffect(() => {
        const { from, to }: { from: Stop, to: Stop } = {
            from: {
                ls_id: Number(router.query['fl'] as string) || 0,
                s_id: Number(router.query['fs'] as string) || 0,
                site_code: router.query['fc'] as string || ''
            },
            to: {
                ls_id: Number(router.query['tl'] as string) || 0,
                s_id: Number(router.query['ts'] as string) || 0,
                site_code: router.query['tc'] as string || ''
            }
        }
        setQuery({
            from,
            to,
            time: {
                hours: router.query['h'] ? Number(router.query['h'] as string) : date.getHours(),
                minutes: router.query['m'] ? Number(router.query['h'] as string) : date.getMinutes(),
                date: router.query['d'] as string || dateString(new Date())
            },
            user: {
                networks: router.query['n'] ? (router.query['n'] as string).split(',') : ["1", "2", "3", "10", "11", "12", "13", "14", "24", "25"],
                actionTimelineType: router.query['t'] ? Number(router.query['t'] as string) : 1
            },
            index: Number(router.query['i'] as string),
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

    useEffect(() => {
        if (details) setDone(true)
    }, [details])

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'indigo',
        primaryShade: 7,
        fontFamily: 'Sora, sans-serif',
        fontSizes: {
            "xs": 18,
            "sm": 20,
            "md": 22,
            "lg": 24,
            "xl": 26,
        }
    }}>
        <Center sx={{ zIndex: 89, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
            <Box id="renderBox" p="md" pb={0} sx={{ zIndex: 90, background: '#25262B', maxWidth: 600 }}>
                <Paper p="sm" radius="lg">
                    {results && <RouteSummary item={results} query={query} />}
                    <Space h='md' />
                    {details && <RouteExposition iconSize={25} details={details} query={query} />}
                    {done ? <div id="done" /> : <></>}
                </Paper>
                <Group py={6} style={{ opacity: .8 }} position="right" spacing={2}>
                    <IconLink size={17} />
                    <Text size={15}>{typeof window !== 'undefined' && location.origin.split("://")[1]}</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

export default Render;