import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { dateString, exposition, route } from "../client"
import { PageHeading } from "../components/page"
import { IconCalendarEvent, IconLine, IconShare } from "@tabler/icons"
import { Accordion, ActionIcon, Group, Loader, Skeleton, Timeline } from "@mantine/core"
import { useMyAccordion } from "../components/styles"
import { ActionBullet, RouteExposition, RouteSummary } from "../components/routes"
import { useEffect, useState } from "react"
import { yahoo, office365, google, ics, outlook } from "calendar-link";
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"

const cal = (service: number, body: any) => {
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

const Route = ({ route, index }: { route: route, index: any }) => {
    const [exposition, setExposition] = useState<Array<exposition>>([])
    const router = useRouter()
    const [file, setFile] = useState<File | undefined>()
    const [body, setBody] = useState<any>()
    const [cookies] = useCookies(["calendar-service"])

    useEffect(() => {
        if (!body && exposition.length) {
            const start = new Date(`${router.query['d'] || dateString(new Date())} ${route.departureTime}`)
            const end = new Date(`${router.query['d'] || dateString(new Date())} ${route.arrivalTime}`)
            setBody({
                start,
                end,
                description: `${exposition.join("\n")}`,
                location: exposition[0].station,
                title: `${route.departure[0]} - ${route.arrival[0]}`
            })
        }
    }, [body, exposition])

    return (<>
        <Accordion.Control onClick={() => {
            apiCall("POST", "/api/exposition", { exposition: route.expositionData.exposition, nativeData: route.expositionData.nativeData, date: dateString(new Date()) }).then(async (e) => {
                setExposition(e.exposition)
                const id = Date.now().toString()
                const image = `/api/render?${router.asPath.split('?')[1]}&d=${router.query['d'] || dateString(new Date())}&i=${index}`
                const blob = await (await fetch(image)).blob()
                setFile(new File([blob], `menetrendek-${id}.jpeg`, { type: "image/jpeg" }))
            })
        }}>
            <RouteSummary item={route} />
        </Accordion.Control>
        <Accordion.Panel>
            {!exposition.length ? (<><Timeline active={Infinity}>{Array(route.expositionData.exposition.runcount * 2).fill(0).map((v, i, arr) => {
                if (i + 1 === arr.length) {// Last element
                    return (<Timeline.Item key={i} bullet={<ActionBullet muvelet="leszállás" network={1} />}>
                        <Skeleton radius="lg" height={53} />
                    </Timeline.Item>)
                } else {
                    return (<Timeline.Item key={i} lineVariant={i % 2 !== 0 ? "dashed" : "solid"} bullet={<ActionBullet muvelet={i % 2 !== 0 ? "átszállás" : "felszállás"} network={1} />}>
                        <Skeleton radius="lg" height={i % 2 === 0 ? 98 : 120} />
                    </Timeline.Item>)
                }
            })}</Timeline>
                <Group position="right">
                    <Loader size={28} />
                </Group>
            </>) : <>
                <RouteExposition exposition={exposition} />
                <Group position="right">
                    <ActionIcon role="button" aria-label="Hozzáadás a naptárhoz" onClick={() => cal(Number(cookies["calendar-service"]), body)}>
                        <IconCalendarEvent />
                    </ActionIcon>
                    {!file ? <Loader size={28} /> :
                        <ActionIcon role="button" aria-label="Megosztás" onClick={() => {
                            const params: any = {
                                from: router.query.from,
                                to: router.query.to,
                                index: index,
                            }
                            navigator.share({ files: [file], url: `https://menetrendek.info/route?${(new URLSearchParams(params)).toString()}`, "title": body.text })
                        }}>
                            <IconShare />
                        </ActionIcon>}
                </Group>
            </>}
        </Accordion.Panel>
    </>)
}

const Routes: NextPage = (props: any) => {
    const { classes, theme } = useMyAccordion()
    return (<>
        <PageHeading title="Járatok" subtitle={`Járatok ${props.routes.fromSettle} és ${props.routes.toSettle} között`} icon={IconLine} />
        <Accordion classNames={classes}>
            {props.routes.routes.map((route: any, i: any) => (
                <Accordion.Item my="sm" key={i.toString()} value={i.toString()}>
                    <Route index={i} route={route} />
                </Accordion.Item>
            ))}
        </Accordion>
    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.SITE_URL}/api/routes`, { from: ctx.query.from, to: ctx.query.to, date: ctx.query.date || dateString(new Date()) })
    }
}

export default Routes