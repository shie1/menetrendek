import { ActionIcon, Avatar, Box, Card, Group, LoadingOverlay, Space, Stack, Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core"
import * as L from "leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from "react";
import proj4 from "proj4";
import {
    IconArrowBigTop,
    IconInfoCircle,
    IconWifi,
    IconQuestionMark,
    IconArrowBigDown,
    IconCheck,
    IconRefresh,
    IconCircle,
} from "@tabler/icons";
import Link from "next/link";
import router from "next/router";
import { currency, calcDisc, ActionBullet } from "./routes";
import { renderToStaticMarkup } from 'react-dom/server'
import { useGeoLocation } from "./geolocation";
import { apiCall } from "./api";
import { union, uniqBy } from "lodash";
import { StopIcon } from "./stops";
import { useCookies } from "react-cookie";

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
const bp: L.LatLngExpression = [47.4979, 19.0402]
const getExtent = (map: L.Map, pad: number = 0) => {
    const bounds = map.getBounds().pad(pad)
    const a = bounds.getNorthWest()
    const b = bounds.getSouthEast()
    return [a.lng, a.lat, b.lng, b.lat]
}

export const RouteMapView = ({ id, details, exposition, query }: { id: any, details: any, exposition: any, query: any }) => {
    const [cookies] = useCookies(["action-timeline-type"])
    const stops = !details ? undefined : (details.results.features as Array<any>).filter((item) => item.geometry.type === "Point")
    const theme = useMantineTheme()
    const color = theme.colors[theme.primaryColor][7]
    const iconProps = { size: 25 }

    useEffect(() => {
        const map = L.map(`map-${id}`).setView(bp, 13);
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
                case 'MultiPoint':
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
        <Box aria-label="Térkép" id={`map-${id}`} sx={({ minHeight: '20rem', fontFamily: 'unset !important' })} />
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

export const MapView = () => {
    const tracking = useRef<any>({ runs: {}, stops: {} })
    const routeLine = useRef<undefined | L.Layer>()
    const [cookies] = useCookies(["blip-limit"])

    useEffect(() => {
        const map = L.map(`map-main`).setView(bp, 13);
        (window as any).map = map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 16,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        map.locate()
        map.on("locationfound", (e) => {
            if (e.accuracy < 150) {
                map.setView(e.latlng)
            }
        })

        return () => { map.off(); map.remove(); (window as any).map = undefined }
    }, [])

    useEffect(() => {
        const stopMarkers = new L.FeatureGroup()

        const stopPin = () => L.divIcon({
            html: renderToStaticMarkup(<ThemeIcon size={20} radius="xl"><IconCircle /></ThemeIcon>),
            className: "map-stop-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 20],
        });

        const load = (map: L.Map) => {
            let checked: Array<any> = []
            apiCall("POST", "/api/map/drawStops", { extent: getExtent(map), radius: 2500, max: 50 }).then((e) => {
                const stops = uniqBy(union(e.results.ls, e.results.ps), (e: any) => e["ls_name"])
                console.log("stops:", stops)

                stops.map((stop: any) => {
                    const stop_id = stop["ls_name"]
                    checked.push(stop_id)
                    if (typeof tracking.current.stops[stop_id] === 'undefined') {
                        const item = (new L.Proj.GeoJSON(stop.geomWgs, { pointToLayer: (feature, latlng) => L.marker(latlng, { icon: stopPin() }) }))
                        item.bindPopup(renderToStaticMarkup(<Stack justify="center" spacing={0}>
                            <Group position="center" align="center" spacing={2} noWrap>
                                <Text align="center" p={2}>{stop["ls_name"]}</Text>
                            </Group>
                        </Stack>))
                        tracking.current.stops[stop_id] = item.getLayers()
                        item.addTo(stopMarkers)
                    }
                })

                for (const key of Object.keys(tracking.current.stops)) {
                    const items: any = tracking.current.stops[key]
                    if (checked.findIndex((e: any) => e == key) === -1) {
                        for (const item of items) {
                            item.off()
                            item.remove()
                            delete tracking.current.stops[key]
                        }
                    }
                }
            })
        };

        stopMarkers.addTo((window as any).map)
        // stops disabled

        // load((window as any).map);
        // ((window as any).map as L.Map).on("moveend", (e) => {
        //     load(e.target)
        // })
        return () => { stopMarkers.off(); stopMarkers.remove(); tracking.current.stops = {} }
    }, [])

    useEffect(() => {
        const runMarkers = new L.FeatureGroup()

        const runPin = (network: number) => L.divIcon({
            html: renderToStaticMarkup(<ThemeIcon size={25} radius="xl"><StopIcon network={network} /></ThemeIcon>),
            className: "map-run-marker",
            iconSize: [25, 25],
            iconAnchor: [25 / 2, 25],
        });

        const update = setInterval(() => {
            let checked: Array<any> = []
            const map: L.Map = (window as any).map
            const distance = map.distance(map.getBounds().getNorthEast(), map.getBounds().getSouthWest())
            apiCall("POST", "/api/map/drawRuns", { extent: getExtent(map, .3), max: cookies["blip-limit"] }).then((e) => {
                e.runs.map((run: any) => {
                    checked.push(run["run_id"])
                    if (typeof tracking.current.runs[run["run_id"]] !== 'undefined') {
                        const items = tracking.current.runs[run["run_id"]]
                        for (const item of items) {
                            item.setLatLng([run.geomWgs.coordinates[1], run.geomWgs.coordinates[0]])
                        }
                    } else {
                        const item = (new L.Proj.GeoJSON(run.geomWgs, { pointToLayer: (feature, latlng) => L.marker(latlng, { icon: runPin(run["network_id"]) }) }))
                        tracking.current.runs[run["run_id"]] = item.getLayers()
                        item.bindPopup(renderToStaticMarkup(<Stack justify="center" spacing={0}>
                            <Group position="center" align="center" spacing={2} noWrap>
                                <Box p={2} sx={(theme) => ({ background: theme.colors.yellow[4] })}>{run["Domain_code"]}</Box>
                                <Box p={2}>{run.regnum}</Box>
                                <Box p={2}>{run.delay}</Box>
                            </Group>
                            <Group position="center" align="center">
                                <Box p={2}>{run.f_settle_name} - {run.l_settle_name}</Box>
                            </Group>
                        </Stack>))
                        item.addEventListener("click", () => {
                            apiCall("POST", "/api/map/drawRunPath", { runId: run["run_id"] }).then((e) => {
                                if (typeof routeLine.current !== 'undefined') {
                                    routeLine.current!.off()
                                    routeLine.current!.remove()
                                }
                                routeLine.current = (new L.Proj.GeoJSON(e.routeData[0].geometry))
                                routeLine.current.addTo(item)
                            })
                        })
                        item.addTo(runMarkers)
                    }
                })
                for (const key of Object.keys(tracking.current.runs)) {
                    const items: any = tracking.current.runs[key]
                    if (checked.findIndex((e: any) => e == key) === -1) {
                        for (const item of items) {
                            item.off()
                            item.remove()
                            delete tracking.current.runs[key]
                        }
                    }
                }
                runMarkers.addTo(map)
            })
        }, 500);
        return () => { clearInterval(update); runMarkers.off(); runMarkers.remove(); tracking.current.runs = {}; routeLine.current = undefined; }
    }, [])

    return (<>
        <Box aria-label="Térkép" id="map-main" sx={({ minHeight: 'calc(100vh - 56px)', fontFamily: 'unset !important', })} />
    </>)
}