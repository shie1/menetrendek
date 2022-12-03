import {
    Accordion,
    ActionIcon,
    Group,
    Loader,
    LoadingOverlay,
    Paper,
    ScrollArea,
    Skeleton,
    Space,
    Timeline,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconDownload, IconX, IconShare } from "@tabler/icons";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import useCookies from "react-cookie/cjs/useCookies";
import { dateString } from "../client";
import { apiCall } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";
import { Stop } from "../components/stops";

const Query = createContext<any>({})
const AccordionFix = createContext<any>([])

const Route = ({ item, val }: { item: any, val: any }) => {
    const router = useRouter()
    const [data, setData] = useState<any>()
    const [open, setOpen] = useState<boolean>(false)
    const query = useContext(Query)
    const [accordion, setAccordion] = useContext(AccordionFix)
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
    const [file, setFile] = useState<File | undefined>()

    useEffect(() => {
        if (accordion != val) { setOpen(false) }
    }, [accordion])

    useEffect(() => {
        setData(undefined)
    }, [router])

    return (<Accordion.Item mb="md" value={val} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)', transition: '.25s', })}>
        <Accordion.Control sx={(theme) => ({ padding: '16px' })} disabled={open && !data} onClick={() => {
            setOpen(!open)
            if (open) {
                setAccordion(0)
            } else {
                setAccordion(val)
            }
            if (!data) {
                apiCall("POST", "/api/exposition", { fieldvalue: item.kifejtes_postjson, nativeData: item.nativeData, datestring: router.query['d'] as string }).then(async (e) => {
                    setData(e)
                    if (open) setAccordion(val)
                    const id = Date.now().toString()
                    const image = `/api/render?${router.asPath.split('?')[1]}&h=${query.hours}&m=${query.minutes}&i=${val}&=${(cookies["selected-networks"] as Array<any>).join(',')}`
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
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [accordion, setAccordion] = useState<any>()
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'selected-networks']);
    const date = new Date()

    useEffect(() => {
        setLoading(true)
        if (router.query['fs']) {
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
                hours: router.query['h'] ? Number(router.query['h'] as string) : date.getHours(),
                minutes: router.query['m'] ? Number(router.query['h'] as string) : date.getMinutes(),
                discount: cookies["discount-percentage"] || 0,
                networks: router.query['n'] ? (router.query['n'] as string).split(',') : cookies["selected-networks"],
                date: router.query['d'] as string || dateString(new Date())
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/routes", query).then(resp => { if (resp.status === 'success') { setResults(resp); setLoading(false) } else { router.push('/'); showNotification({ title: 'Nincs járat!', message: 'Nem találtunk egy jártatot sem a keresés alapján!', color: 'red', icon: <IconX /> }) } })
        }
    }, [query])

    return (<>
        <Query.Provider value={query}>
            <AccordionFix.Provider value={[accordion, setAccordion]}>
                <LoadingOverlay visible={loading} />
                <Accordion mt="sm" value={accordion} chevron={<></>} chevronSize={0} radius="lg" variant="filled" >
                    {results ?
                        Object.keys(results.results.talalatok).map(key => {
                            const item = results.results.talalatok[key]
                            return (<Route val={key} key={key} item={item} />)
                        }
                        ) : <></>}
                </Accordion>
            </AccordionFix.Provider>
        </Query.Provider>
    </>)
}

export default Routes