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
import { LocalizedStrings } from "../pages/api/localization";

export const calcDisc = (fee: number, discount?: number) => {
    return discount ? Math.abs(fee - (fee * (discount / 100))) : fee
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

export const ActionBullet = memo(({ type, muvelet, prev, network, size, ...props }: { type: number, muvelet: string, prev: any, network: number, size?: number }) => {
    if (!size) { size = 20 }
    switch (type) {
        case 1:
        default:
            switch (muvelet) {
                case 'transfer':
                case 'átszállás':
                default:
                    return <StopIcon size={size} network={prev?.network} />
                case 'leszállás':
                    return <StopIcon size={size} network={prev?.network} />
                case 'felszállás':
                    return !prev ? <IconArrowBigDown size={size} /> : prev?.muvelet === "átszállás" || prev?.muvelet === "transfer" ? <IconWalk size={size} /> : <StopIcon size={size} network={network} />
            }
        case 2:
            switch (muvelet) {
                case 'transfer':
                case 'átszállás':
                    return <IconWalk size={size} />
                case 'leszállás':
                    return <IconCheck size={size} />
                default:
                    return <StopIcon size={size} network={network} />
            }
    }
})

export const RouteSummary = memo(({ item, query, strings }: { item: any, query: any, strings: LocalizedStrings }) => {
    const { warning } = useColors()
    const [cookies] = useCookies(["discount-percentage"])
    return (<Stack spacing={0}>
        <Grid>
            <Grid.Col sx={{ position: 'relative' }} span="auto">
                {!item.nativeData[0].FromBay ? <></> :
                    <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, left: 0 }}>{item.nativeData[0].FromBay}</Avatar>}
                <Text align="center" size="xl">{item.indulasi_ido}</Text>
                <Text align="center" size="sm">{item.departureCity}, {item.departureStation}</Text>
            </Grid.Col>
            <Grid.Col span="auto" sx={{ position: 'relative' }}>
                {!item.nativeData[0].ToBay ? <></> :
                    <Avatar variant="outline" m={10} radius="xl" size={26} sx={{ position: 'absolute', top: 0, right: 0 }}>{item.nativeData[0].ToBay}</Avatar>}
                <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                <Text align="center" size="sm">{item.arrivalCity}, {item.arrivalStation}</Text>
            </Grid.Col>
        </Grid>
        <Divider size="lg" my={6} />
        <Text align="center">{item.atszallasok_szama} {strings.transfer} {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={warning} /> : <></>}</Text>
        <Group position="center" spacing='sm'>
            <Text size="sm">{item.osszido}</Text>
            {item.totalFare > 0 ? <Text size="sm">{currency.format(calcDisc(item.totalFare, query.user ? query.user.discount : cookies["discount-percentage"]))}</Text> : <></>}
            <Text size="sm">{item.ossztav}</Text>
        </Group>
    </Stack>)
})

export const RouteExposition = memo(({ details, query, iconSize, withInfoButton, strings }: { details: any, query: any, iconSize?: number, withInfoButton?: boolean, strings: LocalizedStrings }) => {
    const router = useRouter()
    const [cookies] = useCookies(["action-timeline-type", "discount-percentage"])
    return (<Timeline active={99}>
        {!details ? <></> : Object.keys(details.results).map((i: any) => {
            const dataItem = details.results[i]
            return (<Timeline.Item bulletSize={25} key={i} title={dataItem.allomas} bullet={<ActionBullet type={Number(query.user ? query.user.actionTimelineType : cookies["action-timeline-type"])} size={iconSize} prev={details.results[i - 1]} muvelet={dataItem.muvelet} network={dataItem.network} />} lineVariant={dataItem.muvelet === "átszállás" ? "dashed" : "solid"}>
                <Stack spacing={0} sx={{ position: 'relative' }}>
                    <Group align="center">
                        <Text size="xl" mr={-4}>{dataItem.idopont}</Text>
                        {!dataItem.jaratinfo ? <></> :
                            !dataItem.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={30}>{dataItem.jaratinfo.FromBay}</Avatar>}
                    </Group>
                    {!dataItem.jaratinfo ? <></> : <>
                        {!withInfoButton ? <></> : <Group position="right">
                            <Link href={`/runs?id=${dataItem.runId}&s=${dataItem.jaratinfo.StartStation}&e=${dataItem.jaratinfo.EndStation}${!router.query['d'] ? '' : '&d=' + router.query['d']}`}>
                                <ActionIcon role="button" aria-label="Összes megálló megtekintése" sx={{ position: 'absolute', top: 0 }}>
                                    <IconInfoCircle />
                                </ActionIcon>
                            </Link>
                        </Group>}
                        <Group spacing={10}>
                            {!dataItem.jaratinfo.fare || dataItem.jaratinfo.fare < 0 ? <></> :
                                <Text size="sm">{currency.format(calcDisc(dataItem.jaratinfo.fare, query.user ? query.user.discount : cookies["discount-percentage"]))}</Text>}
                            {!dataItem.jaratinfo.travelTime ? <></> :
                                <Text size="sm">{dataItem.jaratinfo.travelTime} {strings.minute}</Text>}
                            {!dataItem.jaratszam ? <></> :
                                <Text size="sm">{dataItem.jaratszam}</Text>}
                        </Group>
                        {!dataItem.vegallomasok ? <></> :
                            <Text size="sm">{dataItem.vegallomasok}</Text>}
                        {!dataItem.jaratinfo.kozlekedik ? <></> :
                            <Text size="sm">{strings.operates} {dataItem.jaratinfo.kozlekedik}</Text>}
                        {!dataItem.jaratinfo.ToBay ? <></> :
                            <Text size="sm">{strings.platform} {strings.atArrival}: {dataItem.jaratinfo.ToBay}</Text>}
                        <Space h={2} />
                        {!dataItem.jaratinfo.wifi ? <></> :
                            <ThemeIcon role="status" aria-label="Wi-Fi elérés" size="lg" variant="light" radius="xl">
                                <IconWifi size={25} />
                            </ThemeIcon>
                        }
                    </>}
                    {!dataItem.TimeForChange ? <></> :
                        <Text size="sm">{strings.timeForTransfer} {dataItem.TimeForChange} {strings.minute}</Text>}
                    {dataItem.muvelet !== "leszállás" ? <Space h="md" /> : <></>}
                </Stack>
            </Timeline.Item>)
        })}
    </Timeline >)
})