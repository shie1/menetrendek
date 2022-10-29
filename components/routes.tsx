import { ActionIcon, Avatar, Divider, Grid, Group, Space, Stack, Text, ThemeIcon, Timeline } from "@mantine/core"
import { IconWalk, IconCheck, IconTrain, IconBus, IconAlertTriangle, IconWifi, IconInfoCircle, IconArrowBarRight, IconArrowBarToRight } from "@tabler/icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import useColors from "./colors"
import { StopIcon } from "../components/stops"

const calcDisc = (fee: number, discount: number) => {
    return Math.abs(fee - (fee * (discount / 100)))
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

export const ActionBullet = ({ muvelet, network, size, ...props }: { muvelet: string, network: number, size?: number }) => {
    if (!size) { size = 20 }
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            return <StopIcon size={size} network={network} />
    }
}

export const RouteSummary = ({ item, query }: { item: any, query: any }) => {
    const { warning } = useColors()
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
        <Text align="center">{item.atszallasok_szama} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={warning} /> : <></>}</Text>
        <Group position="center" spacing='sm'>
            <Text size="sm">{item.osszido}</Text>
            {item.totalFare !== -1 ? <Text size="sm">{currency.format(calcDisc(item.totalFare, query.discount))}</Text> : <></>}
            <Text size="sm">{item.ossztav}</Text>
        </Group>
    </Stack>)
}

export const RouteExposition = ({ details, query, iconSize, withInfoButton }: { details: any, query: any, iconSize?: number, withInfoButton?: boolean }) => {
    const router = useRouter()
    return (<Timeline active={99}>
        {!details ? <></> : Object.keys(details.results).map((i: any) => {
            const dataItem = details.results[i]
            return (<Timeline.Item bulletSize={25} key={i} title={dataItem.allomas} bullet={<ActionBullet size={iconSize} muvelet={dataItem.muvelet} network={dataItem.network} />} lineVariant={dataItem.muvelet === "átszállás" ? "dashed" : "solid"}>
                <Stack spacing={0} sx={{ position: 'relative' }}>
                    <Group align="center">
                        <Text size="xl" mr={-4}>{dataItem.idopont}</Text>
                        {!dataItem.jaratinfo ? <></> :
                            !dataItem.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={30}>{dataItem.jaratinfo.FromBay}</Avatar>}
                    </Group>
                    {!dataItem.jaratinfo ? <></> : <>
                        {!withInfoButton ? <></> : <Group position="right">
                            <Link href={`/runs?id=${dataItem.runId}&s=${dataItem.jaratinfo.StartStation}&e=${dataItem.jaratinfo.EndStation}&d=${router.query['d']}`}>
                                <ActionIcon sx={{ position: 'absolute', top: 0 }}>
                                    <IconInfoCircle />
                                </ActionIcon>
                            </Link>
                        </Group>}
                        <Group spacing={10}>
                            {!dataItem.jaratinfo.fare || dataItem.jaratinfo.fare === -1 ? <></> :
                                <Text size="sm">{currency.format(calcDisc(dataItem.jaratinfo.fare, query.discount))}</Text>}
                            {!dataItem.jaratinfo.travelTime ? <></> :
                                <Text size="sm">{dataItem.jaratinfo.travelTime} perc</Text>}
                            {!dataItem.jaratszam ? <></> :
                                <Text size="sm">{dataItem.jaratszam}</Text>}
                        </Group>
                        {!dataItem.vegallomasok ? <></> :
                            <Text size="sm">{dataItem.vegallomasok}</Text>}
                        {!dataItem.jaratinfo.kozlekedik ? <></> :
                            <Text size="sm">Közlekedik: {dataItem.jaratinfo.kozlekedik}</Text>}
                        {!dataItem.jaratinfo.ToBay ? <></> :
                            <Text size="sm">Kocsiállás érkezéskor: {dataItem.jaratinfo.ToBay}</Text>}
                        <Space h={2} />
                        {!dataItem.jaratinfo.wifi ? <></> :
                            <ThemeIcon size="lg" variant="light" radius="xl">
                                <IconWifi size={25} />
                            </ThemeIcon>
                        }
                    </>}
                    {!dataItem.TimeForChange ? <></> :
                        <Text size="sm">Idő az átszállásra: {dataItem.TimeForChange} perc</Text>}
                    {dataItem.muvelet !== "leszállás" ? <Space h="md" /> : <></>}
                </Stack>
            </Timeline.Item>)
        })}
    </Timeline>)
}