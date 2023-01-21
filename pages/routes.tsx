import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { dateString, exposition, route } from "../client"
import { PageHeading } from "../components/page"
import { IconLine } from "@tabler/icons"
import { Accordion, Skeleton, Timeline } from "@mantine/core"
import { useMyAccordion } from "../components/styles"
import { ActionBullet, RouteExposition, RouteSummary } from "../components/routes"
import { useState } from "react"

const Route = ({ route }: { route: route }) => {
    const [exposition, setExposition] = useState<Array<exposition>>([])

    return (<>
        <Accordion.Control onClick={() => {
            apiCall("POST", "/api/exposition", { exposition: route.expositionData.exposition, nativeData: route.expositionData.nativeData, date: dateString(new Date()) }).then((e) => setExposition(e.exposition))
        }}>
            <RouteSummary item={route} />
        </Accordion.Control>
        <Accordion.Panel>
            {!exposition.length ? (<Timeline active={Infinity}>{Array(route.expositionData.exposition.runcount * 2).fill(0).map((v, i, arr) => {
                if (i + 1 === arr.length) {// Last element
                    return (<Timeline.Item bullet={<ActionBullet muvelet="leszállás" network={1} />}>
                        <Skeleton radius="lg" height={53} />
                    </Timeline.Item>)
                } else {
                    return (<Timeline.Item bullet={<ActionBullet muvelet={i % 2 === 0 ? "átszállás" : "felszállás"} network={1} />}>
                        <Skeleton radius="lg" height={i % 2 === 0 ? 98 : 120} />
                    </Timeline.Item>)
                }
            })}</Timeline>) : <RouteExposition exposition={exposition} />}
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
                    <Route route={route} />
                </Accordion.Item>
            ))}
        </Accordion>
    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/routes`, { from: ctx.query.from, to: ctx.query.to, date: ctx.query.date || dateString(new Date()) })
    }
}

export default Routes