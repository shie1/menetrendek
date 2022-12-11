import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { useEffect, useState } from "react";
import { Query } from "./_app";
import { useRouter } from "next/router";
import { dateString } from "../client";
import { Stop } from "../components/stops";
import { useCookies } from "react-cookie";
import { apiCall } from "../components/api";
import { showNotification } from "@mantine/notifications";
import { IconDownload, IconShare, IconX } from "@tabler/icons";
import { Accordion, ActionIcon, Container, Group, Loader, Skeleton, Space, Timeline } from "@mantine/core"
import { useMyAccordion } from "../components/styles";
import { RouteSummary, RouteExposition } from "../components/routes";

const Route = ({ item, val, query }: { item: any, val: any, query: Query | undefined }) => {
    const router = useRouter()
    const [data, setData] = useState<any>()
    const [open, setOpen] = useState<boolean>(false)
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
    const [file, setFile] = useState<File | undefined>()

    useEffect(() => {
        setData(undefined)
    }, [router])

    return (<Accordion.Item value={val} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)', transition: '.25s', })}>
        <Accordion.Control sx={(theme) => ({ padding: '16px' })} disabled={open && !data} onClick={() => {
            if (!data) {
                apiCall("POST", "/api/exposition", { fieldvalue: item.kifejtes_postjson, nativeData: item.nativeData, datestring: router.query['d'] as string }).then(async (e) => {
                    setData(e)
                    const id = Date.now().toString()
                    const image = `/api/render?${router.asPath.split('?')[1]}&h=${query!.time.hours}&m=${query!.time.minutes}&i=${val}&=${(cookies["selected-networks"] as Array<any>).join(',')}`
                    const blob = await (await fetch(image)).blob()
                    setFile(new File([blob], `menetrendek-${id}.jpeg`, { type: "image/jpeg" }))
                })
            }
        }}>
            <RouteSummary item={item} query={query} />
        </Accordion.Control>
        <Accordion.Panel>
            <Skeleton p="sm" visible={!data} sx={{ width: '100%' }} radius="lg">
                {!data ? <><Timeline>
                    {Array.from({ length: item.kifejtes_postjson.runcount * 2 }).map((item: any, i: any) => {
                        return <Timeline.Item title="Lorem" key={i}>
                            <Space h={50} />
                        </Timeline.Item>
                    })}
                </Timeline>
                    <Group position="right">
                        <ActionIcon>
                            <IconDownload />
                        </ActionIcon>
                    </Group>
                </>
                    :
                    <><RouteExposition details={data} query={query} withInfoButton />
                        <Group position="right">
                            {!file ? <Loader size={28} /> :
                                <ActionIcon onClick={() => {
                                    navigator.share({ files: [file] })
                                }}>
                                    <IconShare />
                                </ActionIcon>}
                        </Group>
                    </>}
            </Skeleton>
        </Accordion.Panel>
    </Accordion.Item>)
}

const Routes: NextPage = () => {
    const router = useRouter()
    const date = new Date()
    const [query, setQuery] = useState<Query | undefined>()
    const { classes, theme } = useMyAccordion()
    const [results, setResults] = useState<any>()
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'selected-networks']);
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        setValue(null)
        setResults(undefined)
        setQuery(undefined)
        if (router.query['fs'] && router.query['ts']) {
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
                    discount: Number(cookies["discount-percentage"]) || 0,
                    networks: router.query['n'] ? (router.query['n'] as string).split(',') : cookies["selected-networks"],
                }
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp) } else { router.push('/'); showNotification({ title: 'Nincs járat!', message: 'Nem találtunk egy jártatot sem a keresés alapján!', color: 'red', icon: <IconX /> }) } })
        }
    }, [query])

    return (<PageTransition>
        <Container size="sm" p={0}>
            <Accordion value={value} onChange={setValue} variant="separated" classNames={classes} className={classes.root}>
                {results ?
                    Object.keys(results.results.talalatok).map(key => {
                        const item = results.results.talalatok[key]
                        return (<Route query={query} val={key} key={key} item={item} />)
                    }
                    ) : <>
                        {[...Array(7)].map((e, i) => <Accordion.Item key={i} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)', transition: '.25s', })} value={i.toString()}><Accordion.Control><Skeleton height={115} /></Accordion.Control></Accordion.Item>)}
                    </>}
            </Accordion>
        </Container>
    </PageTransition>)
}

export default Routes