import { Card, Container, Group, Stack, Text, Timeline } from "@mantine/core";
import { IconArrowBarRight, IconArrowBarToRight, IconMapPin } from "@tabler/icons";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";
import { dateString } from "../client";
import PageTransition from "../components/pageTransition";
import { StopIcon } from "../components/stops";
import { appShortName, appThumb } from "./_document";
import { Canonical, SEO } from "../components/seo";

const Runs: NextPage = (props: any) => {
    const { query, runs, strings } = props
    const [delay, setDelay] = useState<any>(props.delay)
    const [cityState, setCityState] = useState(-1)

    useEffect(() => {
        const interval = setInterval(() => {
            if (query) {
                apiCall("POST", "/api/runsDelay", query).then((e) => { setDelay(e) })
            }
        }, 2 * 1000)

        return () => clearInterval(interval)
    }, [query])

    return (<PageTransition>
        <SEO
            title={props.strings.stopsForX.replace('{0}', `${runs.results.mezo.toString()}/${runs.results.jaratszam.toString()}`)}
            description={props.strings.appDescription}
            image={appThumb}
        >
            <title>{runs.results.mezo.toString()}/{runs.results.jaratszam.toString()} | {appShortName}</title>
            <Canonical url="https://menetrendek.info/runs" />
        </SEO>
        <Container size="xs" p={0}>
            <Card radius="lg" shadow="md" withBorder>
                <Stack my="md" spacing='sm'>
                    <Stack px='md' mb='sm' spacing={0} justify="center" align="center">
                        <Text size={30} mb={-10}>{runs?.results.mezo ? `${runs?.results.mezo}/${runs?.results.jaratszam}` : runs?.results.vonalszam}</Text>
                        <Text size="xl" mb={4}>{runs?.results.kozlekedteti}</Text>
                        <Text size="sm" align="center">{runs?.results.kozlekedik}</Text>
                        {!delay?.result.data.length ? <></> : <Text size="sm">{strings.delay}: {delay?.result.data[0].delay}</Text>}
                    </Stack>
                    <Timeline active={99}>
                        {!runs ? <></> :
                            Object.keys(runs.custom).map((num: any) => {
                                const item = runs.custom[num]
                                const active = cityState > num ? false : cityState == num ? true : false
                                return (<Timeline.Item key={num} bullet={<IconMapPin />} title={<Text size='lg'>{item.departureCity}</Text>}>
                                    <Text size='xs' mt={-4}>{item.start}-{item.end}</Text>
                                    <Timeline my='md' active={99}>
                                        {runs.custom[num].items.map((item: any, i: any) => {
                                            return (<Timeline.Item bullet={<StopIcon network={runs.results.network} />} title={item.departureStation} key={i}>
                                                <Stack>
                                                    <Group spacing={6}>
                                                        {!item.erkezik ? <></> : <Group spacing={4}>
                                                            <IconArrowBarToRight size={20} />
                                                            <Text size='sm'>{item.erkezik}</Text>
                                                        </Group>}
                                                        {!item.indul ? <></> : <Group spacing={4}>
                                                            <IconArrowBarRight size={20} />
                                                            <Text size='sm'>{item.indul}</Text>
                                                        </Group>}
                                                    </Group>
                                                </Stack>
                                            </Timeline.Item>)
                                        })}
                                    </Timeline>
                                </Timeline.Item>)
                            })}
                    </Timeline>
                </Stack>
            </Card>
        </Container>
    </PageTransition >)
}

Runs.getInitialProps = async (ctx) => {
    const host = (process.env.NODE_ENV === "development" ? "http://localhost:3000" : ("https://" + ctx.req?.headers.host) || "https://menetrendek.info")
    let props: any = {}
    if (ctx.query['id']) {
        props.query = {
            id: Number(ctx.query['id'] as string),
            sls: Number(ctx.query['s'] as string),
            els: Number(ctx.query['e'] as string),
            date: ctx.query['d'] as string || dateString(new Date())
        }
    }
    if (props.query) {
        props.runs = await apiCall("POST", `${host}/api/runs`, props.query)
        props.delay = await apiCall("POST", `${host}/api/runsDelay`, props.query)
    }
    return props
}

export default Runs