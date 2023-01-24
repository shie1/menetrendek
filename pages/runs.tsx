import { Card, Container, Group, Stack, Text, Timeline } from "@mantine/core";
import { IconArrowBarRight, IconArrowBarToRight, IconMapPin } from "@tabler/icons";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";
import type { NextPage } from "next";
import { StopIcon } from "../components/stops";

const Runs: NextPage = (props: any) => {
    const runs = props.runs
    const [delay, setDelay] = useState<any>(undefined)
    const query = props.query

    useEffect(() => {
        const interval = setInterval(() => {
            if (query) {
                apiCall("POST", "/api/runsDelay", query).then(setDelay)
            }
        }, 2 * 1000)

        return () => clearInterval(interval)
    }, [query])

    return (<Container size="xs" p={0}>
        <Card radius="lg" shadow="xl" sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
            <Stack my="md" spacing='sm'>
                <Stack px='md' mb='sm' spacing={0} justify="center" align="center">
                    <Text size={30} mb={-10}>{runs?.results.mezo ? `${runs?.results.mezo}/${runs?.results.jaratszam}` : runs?.results.vonalszam}</Text>
                    <Text size="xl" mb={4}>{runs?.results.kozlekedteti}</Text>
                    <Text size="sm" align="center">{runs?.results.kozlekedik}</Text>
                    {!delay?.result.data.length ? <></> : <Text size="sm">Késés: {delay?.result.data[0].delay}</Text>}
                </Stack>
                <Timeline active={Infinity}>
                    {!runs ? <></> :
                        Object.keys(runs.custom).map((num: any) => {
                            const item = runs.custom[num]
                            return (<Timeline.Item key={num} bullet={<IconMapPin />} title={<Text size='lg'>{item.departureCity}</Text>}>
                                <Text size='xs' mt={-4}>{item.start}-{item.end}</Text>
                                <Timeline my='md' active={Infinity}>
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
    </Container>)
}

Runs.getInitialProps = async (ctx: any) => {
    const query = {
        sls: ctx.query['s'],
        els: ctx.query['e'],
        date: ctx.query['d'],
        id: ctx.query['id'],
    }
    return {
        runs: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/runs`, query),
        delay: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/runsDelay`, query), query: query
    }
}

export default Runs