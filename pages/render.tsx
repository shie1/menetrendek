import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { dateString } from "../client";
import { apiCall } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";
import { Stop } from "../components/stops";
import { LocalizedStrings } from "./api/localization";

const Render: NextPage = (props: any) => {
    const { details, results, query, strings } = props

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'indigo',
        primaryShade: 7,
        fontFamily: 'Sora, sans-serif',
        fontSizes: {
            "xs": 18,
            "sm": 20,
            "md": 22,
            "lg": 24,
            "xl": 26,
        }
    }}>
        <Center sx={{ zIndex: 89, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
            <Box id="renderBox" p="md" pb={0} sx={{ zIndex: 90, background: '#25262B', maxWidth: 600 }}>
                <Paper p="sm" radius="lg">
                    <RouteSummary strings={strings} item={results} query={query} />
                    <Space h='md' />
                    <RouteExposition strings={strings} iconSize={25} details={details} query={query} />
                </Paper>
                <Group py={6} style={{ opacity: .8 }} position="right" spacing={2}>
                    <IconLink size={17} />
                    <Text suppressHydrationWarning size={15}>{typeof window !== 'undefined' && location.origin.split("://")[1]}</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

Render.getInitialProps = async (ctx) => {
    const host = (process.env.NODE_ENV === "development" ? "http://localhost:3000" : ("https://" + ctx.req?.headers.host) || "https://menetrendek.info")
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
        user: {
            actionTimelineType: ctx.query['t'] ? Number(ctx.query['t'] as string) : 1
        },
        index: Number(ctx.query['i'] as string),
    }
    props.results = (await apiCall("POST", `${host}/api/routes`, props.query)).results.talalatok[props.query.index]
    props.details = await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/exposition`, { fieldvalue: props.results.kifejtes_postjson, nativeData: props.results.nativeData, datestring: ctx.query['d'] as string })
    return props
}

export default Render;