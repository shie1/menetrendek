import { Avatar, Divider, Grid, Group, Space, Stack, Text, ThemeIcon, Timeline } from "@mantine/core"
import { IconWalk, IconCheck, IconTrain, IconBus, IconAlertTriangle, IconWifi } from "@tabler/icons"
import useColors from "./colors"

const calcDisc = (fee: number, discount: number) => {
    return Math.abs(fee - (fee * (discount / 100)))
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

export const ActionBullet = ({ muvelet, jarmu, size, ...props }: { muvelet: string, jarmu: string, size?: number }) => {
    if (!size) { size = 20 }
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        default:
            switch (jarmu) {
                case 'vonat':
                    return <IconTrain size={size} />
                default:
                    return <IconBus size={size} />
            }
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
            <Grid.Col span="auto">
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

export const RouteExposition = ({ details, query, iconSize }: { details: any, query: any, iconSize?: number }) => {
    return (<Timeline active={99}>
        {!details ? <></> : Object.keys(details.results).map((i: any) => {
            const dataItem = details.results[i]
            return (<Timeline.Item bulletSize={25} key={i} title={dataItem.allomas} bullet={<ActionBullet size={iconSize} muvelet={dataItem.muvelet} jarmu={dataItem.jarmu} />} lineVariant={dataItem.muvelet === "átszállás" ? "dashed" : "solid"}>
                <Stack spacing={0}>
                    <Group align="center">
                        <Text size="xl" mr={-4}>{dataItem.idopont}</Text>
                        {!dataItem.jaratinfo ? <></> :
                            !dataItem.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={30}>{dataItem.jaratinfo.FromBay}</Avatar>}
                    </Group>
                    {!dataItem.jaratinfo ? <></> : <>
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