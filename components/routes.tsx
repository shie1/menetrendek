import {
    ActionIcon,
    Avatar,
    Divider,
    Grid,
    Group,
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
import { memo } from "react";
import { useCookies } from "react-cookie";
import { exposition, route } from "../client";

export const calcDisc = (fee: number, discount?: number) => {
    return discount ? Math.abs(fee - (fee * (discount / 100))) : fee
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

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

export const RouteSummary = memo(({ item, }: { item: route }) => {
    const { warning } = useColors()
    const [cookies] = useCookies(["discount-percentage"])
    return (<Stack spacing={0}>
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
            {item.fare > 0 ? <Text size="sm">{currency.format(calcDisc(item.fare, cookies["discount-percentage"]))}</Text> : <></>}
            <Text size="sm">{item.distance}</Text>
        </Group>
    </Stack>)
})

export const RouteExposition = ({ exposition }: { exposition: Array<exposition> }) => {
    return (<Timeline active={Infinity}>
        {exposition.map((item, index) => (<Timeline.Item key={index} bullet={<ActionBullet muvelet={item.action} network={item.network!} />}>
            <Stack spacing={0}>
                <Text>{item.station}</Text>
                <Text size="xl" my={-2}>{item.time}</Text>
                {!item.fare || !item.distance || !item.duration ? <></> :
                    <Group spacing={10}>
                        {item.fare === -1 ? <></> : <Text size="sm">{currency.format(item.fare)}</Text>}
                        <Text size="sm">{item.distance} km</Text>
                        <Text size="sm">{item.duration} perc</Text>
                    </Group>
                }
                {!item.stations ? <></> : <Text size="sm">{item.stations}</Text>}
                {!item.operates ? <></> : <Text size="sm">Közlekedik: {item.operates}</Text>}
                {!item.timeForTransfer ? <></> :
                    <Text size="sm">Idő az átszállásra: {item.timeForTransfer} perc</Text>}
            </Stack>
        </Timeline.Item>))}
    </Timeline>)
}