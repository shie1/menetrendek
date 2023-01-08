import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appShortName, appThumb } from "./_document";
import { Canonical, SEO } from "../components/seo";
import { useEffect } from "react";
import { LocalizedStrings } from "./api/localization";

const Home: NextPage = (props: any) => {
    const strings: LocalizedStrings = props.strings

    useEffect(() => {
        document.querySelector("iframe")
    }, [])

    return (<PageTransition>
        <SEO
            title={strings.appName}
            description={strings.appDescription}
            image={appThumb}
        >
            <title>{appShortName}</title>
            <Canonical url="https://menetrendek.info/" />
        </SEO>
    </PageTransition>)
}

export default Home
