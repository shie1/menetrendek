import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { dateString } from "../client";
import { apiCall, getHost } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";

const Render: NextPage = (props: any) => {
    const { route, exposition } = props

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
                    <RouteSummary item={route} options={{ hideNetworks: true }} />
                    <Space h='md' />
                    <RouteExposition exposition={exposition} options={{ hideRunsButton: true }} />
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
    const host = getHost(ctx.req)
    let props: any = {}
    const query = {
        from: Number(ctx.query['from'] as string),
        to: Number(ctx.query['to'] as string),
        date: ctx.query['d'] as string || dateString(new Date()),
        index: Number(ctx.query['i'] as string),
    }
    props.route = (await apiCall("POST", `${host}/api/routes`, query)).routes[query.index]
    props.exposition = (await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/exposition`, { exposition: props.route.expositionData.exposition, nativeData: props.route.expositionData.nativeData, datestring: query.date })).exposition
    return props
}

export default Render;