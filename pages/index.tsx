import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appDesc, appName, appShortName } from "./_document";
import { Canonical, SEO } from "../components/seo";

const Home: NextPage = () => {
    return (<PageTransition>
        <SEO
            title={appName}
            description={appDesc}
        >
            <title>{appShortName}</title>
            <Canonical url="https://menetrendek.info/" />
        </SEO>
    </PageTransition>)
}

export default Home
