import { MantineProvider, Center, Paper, Space, Group, Box, Text, Container, LoadingOverlay } from "@mantine/core"
import { IconLink } from "@tabler/icons"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { dateString } from "../client"
import { apiCall } from "../components/api"
import { RouteSummary, RouteExposition } from "../components/routes"
import { Stop } from "../components/stops"

const Route: NextPage = () => {
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

    return (<>
        <Container pt="md" size="sm" p={0}>
            <Paper sx={(theme) => ({
                border: '1px solid transparent',
                position: 'relative',
                transition: 'transform 150ms ease',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                boxShadow: theme.shadows.md,
                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
                borderRadius: theme.radius.lg,
            })} p="lg" radius="lg" style={{ position: 'relative', minHeight: '8rem' }}>
                <LoadingOverlay visible={!results && !details} />
                {results && <RouteSummary item={results} query={query} />}
                <Space h='md' />
                {details && <RouteExposition iconSize={25} details={details} withInfoButton query={query} />}
            </Paper>
        </Container>
    </>)
}

export default Route;