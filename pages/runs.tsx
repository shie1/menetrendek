import { Divider, Group, LoadingOverlay, Stack, Text, Timeline } from "@mantine/core";
import { IconArrowBarRight, IconArrowBarToRight, IconMapPin } from "@tabler/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";
import useColors from "../components/colors";
import { ActionBullet } from "../components/routes";
import { dateString } from "../client";

const format = "YYYY-MM-DD HH:mm"

const Runs: NextPage = () => {
    const [query, setQuery] = useState<any>()
    const [runs, setRuns] = useState<any>()
    const [delay, setDelay] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [cityState, setCityState] = useState(-1)
    const { warning } = useColors()
    const router = useRouter()

    useEffect(() => {
        setLoading(true)
        if (router.query['id']) {
            setQuery({
                id: Number(router.query['id'] as string),
                sls: Number(router.query['s'] as string),
                els: Number(router.query['e'] as string),
                date: router.query['d'] as string || dateString(new Date())
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/runs", query).then((e) => { setRuns(e); setLoading(false) })
            apiCall("POST", "/api/runsDelay", query).then((e) => { setDelay(e) })
        }
        const interval = setInterval(() => {
            if (query) {
                apiCall("POST", "/api/runsDelay", query).then((e) => { setDelay(e) })
            }
        }, 2 * 1000)

        return () => clearInterval(interval)
    }, [query])

    return (<>
        <LoadingOverlay visible={loading} />
        <Stack my="md" spacing='sm'>
            <Stack px='md' mb='sm' spacing={0} justify="center" align="center">
                <Text size={30} mb={-10}>{runs?.results.mezo ? `${runs?.results.mezo}/${runs?.results.jaratszam}` : runs?.results.vonalszam}</Text>
                <Text size="xl" mb={4}>{runs?.results.kozlekedteti}</Text>
                <Text size="sm" align="center">{runs?.results.kozlekedik}</Text>
                {!delay?.result.data.length ? <></> : <Text size="sm">Késés: {delay?.result.data[0].delay}</Text>}
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
                                    return (<Timeline.Item bullet={<ActionBullet network={runs.results.network} />} title={item.departureStation} key={i}>
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
    </>)
}

export default Runs