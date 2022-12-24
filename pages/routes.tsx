import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { Query } from "./_app";
import { useRouter } from "next/router";
import { dateString } from "../client";
import { Stop } from "../components/stops";
import { useCookies } from "react-cookie";
import { apiCall } from "../components/api";
import { showNotification } from "@mantine/notifications";
import {
    IconCalendarEvent,
    IconClock,
    IconDownload,
    IconListDetails,
    IconMap,
    IconShare,
    IconX,
} from "@tabler/icons";
import {
    Accordion,
    ActionIcon,
    Container,
    Group,
    Loader,
    Skeleton,
    Space,
    Timeline,
    Slider,
    Button,
    Text,
} from "@mantine/core";
import { useMyAccordion } from "../components/styles";
import { RouteSummary, RouteExposition } from "../components/routes";
import dynamic from "next/dynamic"
import { yahoo, office365, google, ics, outlook } from "calendar-link";
import { appDesc, appShortName, appThumb } from "./_document";
import { Canonical, SEO } from "../components/seo";

const AccordionController = createContext<{ value: string | null | undefined, setValue: (a: string | null | undefined) => void }>({ value: '', setValue: () => { } })

const RMP = memo((props: any) => {
    if (typeof window === 'undefined') return <></>
    const RouteMapView = dynamic(() => import('../components/routeMap').then((mod) => mod.RouteMapView), {
        ssr: false
    })
    return <RouteMapView {...props} />
})

const Route = ({ item, val, query }: { item: any, val: any, query: Query | undefined }) => {
    const router = useRouter()
    const [mapView, setMapView] = useState<boolean>(false)
    const [data, setData] = useState<any>()
    const [geoInfo, setGeoInfo] = useState<any>()
    const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'calendar-service', "action-timeline-type"]);
    const [file, setFile] = useState<File | undefined>()
    const [body, setBody] = useState<any>()
    const { value, setValue } = useContext(AccordionController)

    useEffect(() => {
        if (val !== value) {
            setMapView(false)
        }
    }, [val, value])

    useEffect(() => {
        setData(undefined)
    }, [router])

    useEffect(() => {
        if (!body && data) {
            const start = new Date(`${query?.time.date} ${item.indulasi_ido}`)
            const end = new Date(`${query?.time.date} ${item.erkezesi_ido}`)
            let details: string[] = []
            for (let ri of Object.keys(data.results)) {
                const action = data.results[ri]
                const fb = action.muvelet === "felszállás" ? action.jaratinfo.FromBay ? `\nKocsiállás: ${action.jaratinfo.FromBay}` : '' : ''
                const more = action.muvelet === "felszállás" ? `${fb}\n${action.jaratinfo.fare} Ft | ${action.jaratinfo.travelTime} perc | ${action.jaratszam}\n${action.vegallomasok}` : ''
                details.push(`- ${action.idopont} ${action.muvelet} ${action.allomas}${more}\n`)
            }
            setBody({
                start,
                end,
                description: `${details.join("\n")}`,
                location: data.results['1'].allomas,
                title: `${item.departureCity} - ${item.arrivalCity}`
            })
        }
    }, [body, query, data])

    const cal = (service: number) => {
        window.open((() => {
            switch (service) {
                case 1:
                    return google(body)
                case 2:
                    return outlook(body)
                case 3:
                    return office365(body)
                case 4:
                    return yahoo(body)
                case 5:
                default:
                    return ics(body)
            }
        })(), "_blank")
    }

    return (<Accordion.Item value={val} sx={(theme) => ({ boxShadow: '5px 5px 3px rgba(0, 0, 0, .25)', transition: '.25s', })}>
        <Accordion.Control role="button" aria-label="Járat kifejtése" onClick={() => {
            if (!data) {
                apiCall("POST", "/api/exposition", { fieldvalue: item.kifejtes_postjson, nativeData: item.nativeData, datestring: router.query['d'] as string }).then(async (e) => {
                    setData(e)
                    const id = Date.now().toString()
                    const image = `/api/render?${router.asPath.split('?')[1]}&h=${query!.time.hours}&m=${query!.time.minutes}&i=${val}&=${(cookies["selected-networks"] as Array<any>).join(',')}&t=${cookies["action-timeline-type"] || 1}`
                    const blob = await (await fetch(image)).blob()
                    setFile(new File([blob], `menetrendek-${id}.jpeg`, { type: "image/jpeg" }))
                })
            }
            if (!geoInfo) {
                apiCall("POST", "/api/geoInfo", { fieldvalue: item.kifejtes_postjson, nativeData: item.nativeData, datestring: router.query['d'] as string }).then(async (e) => {
                    setGeoInfo(e)
                })
            }
        }} sx={(theme) => ({ padding: '16px' })}>
            <RouteSummary item={item} query={query} />
        </Accordion.Control>
        <Accordion.Panel>
            <Skeleton px="sm" visible={!data} sx={{ width: '100%' }} radius="lg">
                {!data ? <div><Timeline>
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
                </div>
                    :
                    <>
                        <Button onClick={() => setMapView(!mapView)} leftIcon={!mapView ? <IconMap /> : <IconListDetails />} variant="light" color="indigo" size="sm" sx={{ width: '100%' }} mb="md">
                            {!mapView ? "Térkép nézet" : "Idővonal nézet"}
                        </Button>
                        {!mapView ? <RouteExposition details={data} query={query} withInfoButton /> : <RMP id={val} details={geoInfo} exposition={data} query={query} />}
                        <Group spacing="sm" position="right">
                            <ActionIcon role="button" aria-label="Mentés naptárba" onClick={() => cal(Number(cookies["calendar-service"]))}>
                                <IconCalendarEvent />
                            </ActionIcon>
                            {!file ? <Loader size={28} /> :
                                <ActionIcon role="button" aria-label="Megosztás" onClick={() => {
                                    const params: any = {
                                        ...(query?.from!.ls_id ? { fl: query?.from!.ls_id.toString() } : {}),
                                        fs: query?.from!.s_id.toString(),
                                        ...(query?.from!.site_code ? { fc: query?.from!.site_code } : {}),
                                        ...(query?.to!.ls_id ? { tl: query?.to!.ls_id.toString() } : {}),
                                        ts: query?.to!.s_id.toString(),
                                        ...(query?.to!.site_code ? { tc: query?.to!.site_code } : {}),
                                        d: query?.time.date || dateString(new Date()),
                                        i: val,
                                    }
                                    navigator.share({ files: [file], url: `https://menetrendek.info/route?${(new URLSearchParams(params)).toString()}`, "title": body.text })
                                }}>
                                    <IconShare />
                                </ActionIcon>}
                        </Group>
                    </>}
            </Skeleton>
        </Accordion.Panel>
    </Accordion.Item >)
}

const Routes: NextPage = (props: any) => {
    const router = useRouter()
    const query = props.query
    const { classes, theme } = useMyAccordion()
    const [time, setTime] = useState<number | null>(null)
    const [sliderVal, setSliderVal] = useState<number | undefined>()
    const results = props.results
    const [display, setDisplay] = useState<any>([])
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'selected-networks', 'action-timeline-type', 'route-limit', 'use-route-limit']);
    const [value, setValue] = useState<string | null>();

    useEffect(() => {
        props.query.user = {
            discount: Number(cookies["discount-percentage"]) || 0,
            networks: router.query['n'] ? (router.query['n'] as string).split(',') : cookies["selected-networks"],
            actionTimelineType: Number(cookies["action-timeline-type"])
        }
    }, [router, cookies, props])

    useEffect(() => {
        setValue(null)
    }, [router])

    useEffect(() => {
        if (results.status !== 'success') {
            router.push('/')
            showNotification({ title: 'Nincs járat!', message: 'Nem találtunk egy jártatot sem a keresés alapján!', color: 'red', icon: <IconX />, id: "error-no-routes" })
        }
    }, [results])

    useEffect(() => {
        if (query) {
            if (time === null && query?.time.date === dateString(new Date())) setTime(typeof query.time.hours !== 'undefined' && typeof query.time.minutes !== 'undefined' ? (query.time.hours * 60 + query.time.minutes) : ((new Date()).getHours() * 60 + (new Date()).getMinutes()))
        }
    }, [time, query])

    useEffect(() => {
        setSliderVal(time!)
    }, [time])

    useEffect(() => {
        if (results.status === "success") {
            if (cookies["use-route-limit"] === "true") {
                let disp: any = []
                setDisplay(Object.keys(results.results.talalatok).map((key) => {
                    const item = results.results.talalatok[key]
                    const start = item.indulasi_ido.split(":").map((e: string) => Number(e))
                    const startmin = start[0] * 60 + start[1]
                    if (startmin <= time!) return
                    disp.push(key)
                }))
                setDisplay(disp)
            } else {
                setDisplay([...Array(100).keys()].map(e => e.toString()))
            }
        }
    }, [time, results])

    const marks = () => {
        let m: any = []
        for (let i = 0; i < 9; i++) {
            m.push({ label: (i * 3).toString().padStart(2, '0'), value: i * 3 * 60 })
        }
        return m
    }

    return (<PageTransition>
        {cookies["use-route-limit"] !== 'true' ? <></> : <Slider value={sliderVal || 0} onChange={setSliderVal} thumbChildren={<IconClock size={30} />} styles={{ thumb: { borderWidth: 0, padding: 0, height: 25, width: 25 } }} onChangeEnd={setTime} marks={marks()} min={0} max={1440} mb="xl" size="lg" label={(e) => `${Math.floor(e / 60).toString().padStart(2, '0')}:${(e % 60).toString().padStart(2, '0')}`} />}
        <SEO
            title={`Járatok ${results.nativeResults.Params["FromSettle:"].toString()} és ${results.nativeResults.Params["ToSettle:"].toString()} között`}
            description={appDesc}
            image={appThumb}
        >
            <title>{results.nativeResults.Params["FromSettle:"].toString()} - {results.nativeResults.Params["ToSettle:"].toString()} | {appShortName}</title>
            <Canonical url="https://menetrendek.info/routes" />
        </SEO>
        <Container pt="md" size="sm" p={0}>
            <AccordionController.Provider value={{ value, setValue }}>
                <Accordion value={value || ""} onChange={setValue} variant="separated" classNames={classes} className={classes.root}>
                    {!display.length ? <Text size="sm" align="center" color="dimmed">A kijelölt idő után már nem megy egy járat sem.</Text> :
                        display.map((key: any, i: any) => {
                            const item = results.results.talalatok[key]
                            if (!item) return <></>
                            const start = item.indulasi_ido.split(":").map((e: string) => Number(e))
                            const startmin = start[0] * 60 + start[1]
                            if (cookies["use-route-limit"] === "true" && startmin <= time! || i > Number(cookies["route-limit"])) return <></>
                            return (<Route query={query} val={key} key={key} item={item} />)
                        })
                    }
                </Accordion>
            </AccordionController.Provider>
        </Container>
    </PageTransition>)
}

Routes.getInitialProps = async (ctx) => {
    let props: any = {}
    if (ctx.query['fs'] && ctx.query['ts']) {
        const { from, to }: { from: Stop, to: Stop } = {
            from: {
                ls_id: Number(ctx.query['fl'] as string) || 0,
                s_id: Number(ctx.query['fs'] as string) || 0,
                site_code: ctx.query['fc'] as string || ''
            },
            to: {
                ls_id: Number(ctx.query['tl'] as string) || 0,
                s_id: Number(ctx.query['ts'] as string) || 0,
                site_code: ctx.query['tc'] as string || ''
            }
        }
        props.query = {
            from,
            to,
            time: {
                hours: typeof ctx.query['h'] !== 'undefined' ? Number(ctx.query['h'] as string) : undefined,
                minutes: typeof ctx.query['m'] !== 'undefined' ? Number(ctx.query['m'] as string) : undefined,
                date: ctx.query['d'] as string || dateString(new Date())
            }
        }
    }
    props.results = await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/routes`, props.query)
    return props
}

export default Routes 