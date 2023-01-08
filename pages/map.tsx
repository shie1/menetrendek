import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appShortName, appThumb } from "./_document";
import { memo } from "react";
import dynamic from "next/dynamic"
import { Canonical, SEO } from "../components/seo";

const MP = memo((props: any) => {
    if (typeof window === 'undefined') return <></>
    const MapView = dynamic(() => import('../components/routeMap').then((mod) => mod.MapView), {
        ssr: false
    })
    return <MapView {...props} />
})

const Map: NextPage = (props: any) => {
    return (<PageTransition>
        <SEO
            title={props.strings.realtimeTransitMap}
            description={props.strings.realtimeTransitMapSubtext}
            image={appThumb}
        >
            <title>{props.strings.map} | {appShortName}</title>
            <Canonical url="https://menetrendek.info/map" />
        </SEO>
        <MP {...props} />
    </PageTransition>)
}

export default Map;