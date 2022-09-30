import { Accordion, Center, Divider, Grid, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";

const Routes: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<any>(null)
    const [results, setResults] = useState<any>(null)

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
            apiCall("POST", "/api/routes", query).then(resp => { setLoading(false); if (resp.status === 'success') setResults(resp) })
        }
    }, [query])

    return (<>
        <Head>
            <title>Menetrendek</title>
        </Head>
        <LoadingOverlay visible={loading} />
        <Accordion chevron={false} chevronSize={0} radius="lg" variant="filled" >
            {results ?
                Object.keys(results.results.talalatok).map(key => {
                    const item = results.results.talalatok[key]
                    return (
                        <Accordion.Item mb="md" key={key} value={key} sx={{ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)' }}>
                            <Accordion.Control>
                                <Stack spacing={0}>
                                    <Grid>
                                        <Grid.Col span="auto">
                                            <Text align="center" size="xl">{item.indulasi_ido}</Text>
                                            <Text align="center" size="sm">{item.indulasi_hely}</Text>
                                        </Grid.Col>
                                        <Grid.Col span="auto">
                                            <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                                            <Text align="center" size="sm">{item.erkezesi_hely}</Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Divider size="lg" my={6} />
                                    <Group position="center" spacing='sm'>
                                        <Text size="sm">{item.osszido}</Text>
                                        <Text size="sm">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(item.totalFare)}</Text>
                                        <Text size="sm">{item.ossztav}</Text>
                                    </Group>
                                </Stack>
                            </Accordion.Control>
                            <Accordion.Panel>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                }
                ) : <></>}
        </Accordion>
    </>)
}

export default Routes