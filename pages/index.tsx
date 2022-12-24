import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { appDesc, appName, appShortName } from "./_document";
import { SEO } from "../components/seo";

const Home: NextPage = () => {
    return (<PageTransition>
        <SEO>
            <title>{appShortName}</title>

            <meta name="title" content={appName} />
            <meta name="description" content={appDesc} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={appName} />
            <meta property="og:description" content={appDesc} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={appName} />
            <meta property="twitter:description" content={appDesc} />

        </SEO>
    </PageTransition>)
}

export default Home
