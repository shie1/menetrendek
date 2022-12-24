import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appShortName } from "./_document";
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

const Map: NextPage = () => {
    return (<PageTransition>
        <SEO
            title="Valós idejű tömegközlekedési térkép"
            description="Tekintse meg magyarország valós idejű tömegközlekedési térképét."
        >
            <title>Térkép | {appShortName}</title>
            <Canonical url="https://menetrendek.info/map" />
        </SEO>
        <MP />
    </PageTransition>)
}

export default Map;