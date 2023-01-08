import { Paper, Space, Container, LoadingOverlay } from "@mantine/core";
import type { NextPage } from "next"
import { dateString } from "../client"
import { apiCall, getHost } from "../components/api"
import { Stop } from "../components/stops"
import dynamic from "next/dynamic"
import { appShortName, appThumb } from "./_document";
import { Canonical, SEO } from "../components/seo"

const RouteSummary = dynamic(() => import('../components/routes').then((mod) => mod.RouteSummary), {
    ssr: false
})
const RouteExposition = dynamic(() => import('../components/routes').then((mod) => mod.RouteExposition), {
    ssr: false
})

const Route: NextPage = (props: any) => {
    const { results, details, query, strings } = props

    return (<>
        <SEO
            title={`${strings.transitRoute}: ${results.departureCity} - ${results.arrivalCity}`}
            description={strings.appDescription}
            image={appThumb}
        >
            <title>{results.departureCity} - {results.arrivalCity} | {appShortName}</title>
            <Canonical url="https://menetrendek.info/route" />
        </SEO>
        <Container pt="md" size="sm" p={0}>
            <Paper sx={(theme) => ({
                border: '1px solid transparent',
                position: 'relative',
                transition: 'transform 150ms ease',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                boxShadow: theme.shadows.md,
                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
                borderRadius: theme.radius.lg,
            })} p="lg" radius="lg" style={{ position: 'relative', minHeight: '8rem' }}>
                <LoadingOverlay visible={!results && !details} />
                <RouteSummary strings={strings} item={results} query={query} />
                <Space h='md' />
                <RouteExposition strings={strings} iconSize={25} details={details} withInfoButton query={query} />
            </Paper>
        </Container>
    </>)
}

Route.getInitialProps = async (ctx) => {
    const host = getHost(ctx.req)
    let props: any = {}
    const date = new Date()
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
            hours: ctx.query['h'] ? Number(ctx.query['h'] as string) : date.getHours(),
            minutes: ctx.query['m'] ? Number(ctx.query['h'] as string) : date.getMinutes(),
            date: ctx.query['d'] as string || dateString(new Date())
        },
        index: Number(ctx.query['i'] as string),
    }
    props.results = (await apiCall("POST", `${host}/api/routes`, props.query)).results.talalatok[props.query.index]
    props.details = await apiCall("POST", `${host}/api/exposition`, { fieldvalue: props.results.kifejtes_postjson, nativeData: props.results.nativeData, datestring: ctx.query['d'] as string })
    props.asPath = ctx.asPath
    return props
}

export default Route;