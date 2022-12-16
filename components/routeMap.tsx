import { ActionIcon, Avatar, Box, Card, Group, LoadingOverlay, Space, Stack, Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core"
import * as L from "leaflet"
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useState } from "react"
import proj4 from "proj4";
import { IconArrowBigTop, IconInfoCircle, IconWifi, IconQuestionMark, IconArrowBigDown, IconCheck, IconRefresh } from "@tabler/icons";
import Link from "next/link";
import router from "next/router";
import { currency, calcDisc, ActionBullet } from "./routes";
import { useCookies } from "react-cookie";
import { renderToStaticMarkup } from 'react-dom/server'
require("proj4leaflet")
require("leaflet.markercluster")

proj4.defs("EPSG:23700", "+title=Hungarian EOV EPSG:23700 +proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +datum=HD72 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs");
const crs = {
    crs: {
        type: "name",
        properties: {
            name: "EPSG:23700"
        }
    }
}

const RouteMapView = ({ id, details, exposition, query }: { id: any, details: any, exposition: any, query: any }) => {
    const [cookies] = useCookies(["action-timeline-type"])
    const stops = !details ? undefined : (details.results.features as Array<any>).filter((item) => item.geometry.type === "Point")
    const theme = useMantineTheme()
    const color = theme.colors[theme.primaryColor][7]
    const iconProps = { size: 25 }

    useEffect(() => {
        const map = L.map(`map-${id}`).setView([51.59, -0.09], 13);
        (window as any).map = map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return () => { map.off(); map.remove(); (window as any).map = undefined }
    }, [])

    useEffect(() => {
        const markers = L.markerClusterGroup({
            spiderfyDistanceMultiplier: .05,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            iconCreateFunction: (cluster) => {
                return L.divIcon({ html: (renderToStaticMarkup(<ThemeIcon radius="xl"><IconRefresh {...iconProps} /></ThemeIcon>)) });
            },
            animate: true,
        });
        const mapPin = (muvelet: string) => L.divIcon({
            html: renderToStaticMarkup(<ThemeIcon radius="xl">{(() => {
                switch (muvelet) {
                    case 'felszall':
                        return <IconArrowBigTop {...iconProps} />
                    case 'atszallashoz_felszall':
                        return <IconArrowBigTop {...iconProps} />
                    case 'atszallashoz_leszall':
                        return <IconArrowBigDown {...iconProps} />
                    case 'leszall':
                        return <IconCheck {...iconProps} />
                    default:
                        return <IconQuestionMark {...iconProps} />
                }
            })()}</ThemeIcon>),
            className: "map-pin-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 20],
        });
        const [inside, outside] = [new L.FeatureGroup(), new L.FeatureGroup()]
        for (let feature of details.results.features) {
            if (feature.geometry.type === "MultiPoint") { continue }
            const geoJson: any = {
                ...feature,
                ...crs
            }
            const elem = L.Proj.geoJson(geoJson, { style: { weight: 3 }, pointToLayer: (feature, latlng) => L.marker(latlng, { icon: mapPin(geoJson.properties.type) }) })
            switch (feature.geometry.type) {
                case 'Point':
                    elem.addTo(markers)
                    break
                case 'LineString':
                    if (feature.properties.inside) { elem.addTo(inside) } else { elem.addTo(outside) }
                    inside.setStyle({ color: color })
                    outside.setStyle({ color: theme.colors.gray[7], dashArray: [10, 5] })
                    break
                default:
                    break
            }
        }
        outside.addTo((window as any).map)
        inside.addTo((window as any).map)
        markers.addTo((window as any).map);
        (window as any).map.flyToBounds(inside.getBounds(), { duration: .5 })
    }, [details])

    return (<Box sx={{ minHeight: '20rem', position: 'relative', display: 'flex', flexWrap: 'wrap', '& > *': { flex: '40%', minWidth: '20rem' } }} mb="sm">
        <LoadingOverlay visible={!details} />
        <Box id={`map-${id}`} sx={({ minHeight: '20rem', fontFamily: 'unset !important' })} />
        <Card sx={(theme) => ({ borderRadius: 0 })}>
            <Timeline active={Infinity}>
                {!stops ? <></> : stops.map((stop: any, i: any) => {
                    const focus = () => {
                        const emptyPin = L.divIcon({
                            html: ``,
                            className: "empty-marker",
                            iconSize: [0, 0],
                            iconAnchor: [0, 0],
                        });
                        var feature = L.Proj.geoJson({ ...stop, ...crs }, { pointToLayer: (feature, latlng) => L.marker(latlng, { icon: emptyPin }) }).addTo((window as any).map);
                        (window as any).map.flyToBounds(feature.getBounds(), { maxZoom: 15, duration: .5 })
                        feature.off()
                        feature.remove()
                    }
                    stop.details = exposition.results[i + 1]
                    return (<Timeline.Item bullet={<Box onClick={focus} p={0} m={0} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><ActionBullet size={18} muvelet={stop.details.muvelet} network={stop.details.network} prev={exposition.results[i]} type={cookies["action-timeline-type"]} /></Box>} key={i} title={
                        <Stack spacing={0} mb={-6} sx={{ cursor: 'pointer', '& > *': { lineHeight: '125%' } }} onClick={focus}>
                            <Text>{stop.properties.names[0]}</Text>
                            <Group align="center">
                                <Text size="xl" mr={-4}>{stop.details.idopont}</Text>
                                {!stop.details.jaratinfo ? <></> :
                                    !stop.details.jaratinfo.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={30}>{stop.details.jaratinfo.FromBay}</Avatar>}
                            </Group>
                        </Stack>
                    }>
                        <Stack spacing={0} sx={{ position: 'relative' }}>
                            {!stop.details.jaratinfo ? <></> : <>
                                <Group position="right">
                                    <Link href={`/runs?id=${stop.details.runId}&s=${stop.details.jaratinfo.StartStation}&e=${stop.details.jaratinfo.EndStation}${!router.query['d'] ? '' : '&d=' + router.query['d']}`}>
                                        <ActionIcon sx={{ position: 'absolute', top: 0 }}>
                                            <IconInfoCircle />
                                        </ActionIcon>
                                    </Link>
                                </Group>
                                <Group spacing={10}>
                                    {!stop.details.jaratinfo.fare || stop.details.jaratinfo.fare < 0 ? <></> :
                                        <Text size="sm">{currency.format(calcDisc(stop.details.jaratinfo.fare, query.user.discount))}</Text>}
                                    {!stop.details.jaratinfo.travelTime ? <></> :
                                        <Text size="sm">{stop.details.jaratinfo.travelTime} perc</Text>}
                                    {!stop.details.jaratszam ? <></> :
                                        <Text size="sm">{stop.details.jaratszam}</Text>}
                                </Group>
                                {!stop.details.vegallomasok ? <></> :
                                    <Text size="sm">{stop.details.vegallomasok}</Text>}
                                {!stop.details.jaratinfo.kozlekedik ? <></> :
                                    <Text size="sm">Közlekedik: {stop.details.jaratinfo.kozlekedik}</Text>}
                                {!stop.details.jaratinfo.ToBay ? <></> :
                                    <Text size="sm">Kocsiállás érkezéskor: {stop.details.jaratinfo.ToBay}</Text>}
                                <Space h={2} />
                                {!stop.details.jaratinfo.wifi ? <></> :
                                    <ThemeIcon size="lg" variant="light" radius="xl">
                                        <IconWifi size={25} />
                                    </ThemeIcon>
                                }
                            </>}
                            {!stop.details.TimeForChange ? <></> :
                                <Text size="sm">Idő az átszállásra: {stop.details.TimeForChange} perc</Text>}
                            {stop.details.muvelet !== "leszállás" ? <Space h="md" /> : <></>}
                        </Stack>
                    </Timeline.Item>)
                })}
            </Timeline>
        </Card>
    </Box>)
}

export default RouteMapView;