import {
    ActionIcon,
    Avatar,
    Divider,
    Grid,
    Group,
    Modal,
    Space,
    Stack,
    Text,
    ThemeIcon,
    Timeline,
} from "@mantine/core";
import { IconWalk, IconCheck, IconAlertTriangle, IconWifi, IconInfoCircle, IconArrowBigDown } from "@tabler/icons";
import Link from "next/link"
import { useRouter } from "next/router"
import useColors from "./colors"
import { StopIcon } from "../components/stops"
import { memo, useState } from "react";
import { useCookies } from "react-cookie";
import { dateString, exposition, route } from "../client";
import { useMediaQuery } from "@mantine/hooks";
import Runs from "../pages/runs";

export const calcDisc = (fee: number, discount?: number) => {
    return discount ? Math.abs(fee - (fee * (discount / 100))) : fee
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })
function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

export const ActionBullet = memo(({ muvelet, network, size, ...props }: { muvelet: "átszállás" | "leszállás" | "felszállás", network?: number, size?: number }) => {
    if (!size) { size = 20 }
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            return <StopIcon size={size} network={network!} />
    }
})

export const RouteSummary = memo(({ item, options }: { item: route, options?: { hideNetworks?: boolean } }) => {
    const { warning } = useColors()
    const [cookies] = useCookies(["discount-percentage"])
    const breakPoint = useMediaQuery("(max-width: 600px)")
    return (<Stack sx={{ position: 'relative' }} spacing={0}>
        {options?.hideNetworks ? <></> :
            <Group sx={(theme) => (breakPoint ? {} : { position: 'absolute', width: '100%', top: 0, left: 0 })} position="center">
                {item.networks.filter(onlyUnique).map((network: number, i: any) => (<StopIcon key={i} network={network} />))}
            </Group>
        }
        <Grid>
            <Grid.Col sx={{ position: 'relative' }} span="auto">
                {!item.departurePlatform ? <></> :
                    <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, left: 0 }}>{item.departurePlatform}</Avatar>}
                <Text align="center" size="xl">{item.departureTime}</Text>
                <Text align="center" size="sm">{item.departure[0]}, {item.departure[1]}</Text>
            </Grid.Col>
            <Grid.Col span="auto" sx={{ position: 'relative' }}>
                {!item.arrivalPlatform ? <></> :
                    <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, right: 0 }}>{item.arrivalPlatform}</Avatar>}
                <Text align="center" size="xl">{item.arrivalTime}</Text>
                <Text align="center" size="sm">{item.arrival[0]}, {item.arrival[1]}</Text>
            </Grid.Col>
        </Grid>
        <Divider size="lg" my={6} />
        <Text align="center">{item.transfers} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={warning} /> : <></>}</Text>
        <Group position="center" spacing='sm'>
            <Text size="sm">{item.duration}</Text>
            {item.fare > 0 ? <Text suppressHydrationWarning size="sm">{currency.format(calcDisc(item.fare, cookies["discount-percentage"]))}</Text> : <></>}
            <Text size="sm">{item.distance}</Text>
        </Group>
    </Stack>)
})

export const RouteExposition = ({ exposition, options }: { exposition: Array<exposition>, options?: { hideRunsButton?: boolean } }) => {
    const [cookies] = useCookies(["discount-percentage"])
    const router = useRouter()
    return (<Timeline active={Infinity}>
        {exposition.map((item, index) => (<Timeline.Item lineVariant={item.action === "átszállás" ? "dashed" : "solid"} key={index} bullet={<ActionBullet muvelet={item.action} network={item.network!} />}>
            <Stack spacing={0}>
                <Group spacing={0} position="apart">
                    <Stack spacing={0}>
                        <Text>{item.station}</Text>
                        <Text size="xl" my={-2}>{item.time}</Text>
                    </Stack>
                    {!item.runsData || options?.hideRunsButton ? <></> :
                        <Link href={`/runs?${new URLSearchParams({ id: item.runsData.runId, s: item.runsData.sls, e: item.runsData.sls, d: router.query['d'] as string || dateString(new Date()) }).toString()}`}>
                            <ActionIcon>
                                <IconInfoCircle />
                            </ActionIcon>
                        </Link>
                    }
                </Group>
                {!item.fare || !item.distance || !item.duration ? <></> :
                    <Group spacing={10}>
                        {item.fare === -1 ? <></> : <Text suppressHydrationWarning size="sm">{currency.format(calcDisc(item.fare, cookies["discount-percentage"]))}</Text>}
                        <Text size="sm">{item.distance} km</Text>
                        <Text size="sm">{item.duration} perc</Text>
                    </Group>
                }
                {!item.stations ? <></> : <Text size="sm">{item.stations}</Text>}
                {!item.operates ? <></> : <Text size="sm">Közlekedik: {item.operates}</Text>}
                {!item.timeForTransfer ? <></> :
                    <Text size="sm">{item.timeForTransfer}</Text>}
            </Stack>
        </Timeline.Item>))}
    </Timeline>)
}