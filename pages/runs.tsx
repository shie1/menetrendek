import { Group, Loader, LoadingOverlay, Progress, Stack, Text, Timeline, Transition, useMantineTheme } from "@mantine/core";
import { IconArrowBarRight, IconArrowBarToRight, IconBus, IconCircle } from "@tabler/icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { apiCall } from "../components/api";
import { useTime } from "../components/time"
import moment from 'moment';
import { Dev } from "./_app";

const format = "YYYY-MM-DD HH:mm"

const Runs: NextPage = () => {
    const [query, setQuery] = useState<any>()
    const [runs, setRuns] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [cityState, setCityState] = useState(0)
    const [finished, setFinished] = useState(false)
    const [stationState, setStationState] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const router = useRouter()
    const now = useTime()
    const [dev] = useContext(Dev)

    useEffect(() => {
        setLoading(true)
        if (router.query['id']) {
            setQuery({
                id: Number(router.query['id'] as string),
                sls: Number(router.query['s'] as string),
                els: Number(router.query['e'] as string),
                date: router.query['d'] as string
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/runs", query).then((e) => { setRuns(e); setLoading(false) })
        }
        const interval = setInterval(() => {
            if (query) {
                apiCall("POST", "/api/runs", query).then((e) => { setRuns(e); setLoading(false) })
            }
        }, 10 * 1000)

        return () => clearInterval(interval)
    }, [query])

    useEffect(() => {
        if (runs) {
            const today = `${now.year()}-${now.month() + 1}-${now.date()}`

            Object.keys(runs.custom).map((city: string, i: any) => {
                const item = runs.custom[city]
                const range = { start: moment(`${today} ${item.start}`, format), end: moment(`${today} ${item.end}`, format) }
                if (now.isAfter(range.start)) { setCityState(i + 1) }
            })
        }
    }, [runs, now])

    useEffect(() => {
        if (runs && cityState) {
            const today = `${now.year()}-${now.month() + 1}-${now.date()}`

            runs.custom[cityState - 1].items.map((item: any, i: any) => {
                const range = { start: moment(`${today} ${item.start}`, format), end: moment(`${today} ${item.end}`, format) }
                if (now.isAfter(range.start)) { setStationState(i + 1) }
            })
        }
    }, [cityState, runs, now])

    useEffect(() => {
        if (runs && cityState && stationState) {
            const today = `${now.year()}-${now.month() + 1}-${now.date()}`
            const item = runs.custom[cityState].items[stationState - 1]
            if (!item) { return }
            const range = { start: moment(`${today} ${item.indul}`, format), end: item.utveg ? moment(`${today} ${item.utveg}`, format) : false }
            if (range.end) { setPercentage(((now.unix() - range.start.unix()) / ((range.end as moment.Moment).unix() - range.start.unix())) * 100) } else { setFinished(true) }
        }
    }, [cityState, runs, now, stationState])

    return (<>
        <LoadingOverlay visible={loading} />
        <Stack my="md" spacing='sm'>
            <Stack mb='sm' spacing={0} justify="center" align="center">
                <Text size={30} mb={-10}>{runs?.results.mezo ? `${runs?.results.mezo}/${runs?.results.jaratszam}` : runs?.results.vonalszam}</Text>
                <Text size="xl">{runs?.results.kozlekedteti}</Text>
                <Text size="sm">{runs?.results.kozlekedik}</Text>
                {dev ? `${cityState}|${stationState}` : ''}
            </Stack>
            <Timeline active={cityState - 1}>
                {!runs ? <></> :
                    Object.keys(runs.custom).map((num: any) => {
                        const item = runs.custom[num]
                        const active = cityState > num ? false : cityState == num ? true : false
                        return (<Timeline.Item key={num} bullet={<IconCircle />} title={<Text size='lg'>{item.departureCity}</Text>}>
                            <Text size='xs' mt={-4}>{item.start}-{item.end}</Text>
                            <Timeline my='md' active={cityState > num ? 99 : cityState == num ? stationState : -1}>
                                {runs.custom[num].items.map((item: any, i: any) => {
                                    return (<Timeline.Item bullet={<IconBus />} title={item.departureStation} key={i}>
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
                                            <Transition mounted={active && stationState == i + 1 && !finished} transition="slide-down">
                                                {(styles) => (<Progress style={styles} value={percentage} />)}
                                            </Transition>
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