import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appDesc, appName, appShortName, appThumb } from "./_document";
import { Canonical, SEO } from "../components/seo";
import { useEffect } from "react";

const Home: NextPage = () => {
    useEffect(() => {
        document.querySelector("iframe")
    }, [])

    return (<PageTransition>
        <SEO
            title={appName}
            description={appDesc}
            image={appThumb}
        >
            <title>{appShortName}</title>
            <Canonical url="https://menetrendek.info/" />
        </SEO>
    </PageTransition>)
}

export default Home
