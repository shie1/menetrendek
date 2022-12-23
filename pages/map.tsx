import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { Helmet } from "react-helmet-async";
import { appShortName } from "./_document";
import { memo } from "react";
import dynamic from "next/dynamic"

const MP = memo((props: any) => {
    if (typeof window === 'undefined') return <></>
    const MapView = dynamic(() => import('../components/routeMap').then((mod) => mod.MapView), {
        ssr: false
    })
    return <MapView {...props} />
})

const Map: NextPage = () => {
    return (<PageTransition>
        <Helmet>
            <title>Térkép | {appShortName}</title>
        </Helmet>
        <MP />
    </PageTransition>)
}

export default Map;