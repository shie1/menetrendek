import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";

const Render: NextPage = () => {
    const [results, setResults] = useState<any>()
    const [details, setDetails] = useState<any>()
    const [done, setDone] = useState(false)
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

    useEffect(() => {
        if (details) setDone(true)
    }, [details])

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'grape',
        primaryShade: 8,
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
                    <Text size={15}>menetrendek.shie1bi.hu</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

export default Render;