import type { NextPage } from "next";
import PageTransition from "../components/pageTransition";
import { Helmet } from "react-helmet-async";
import { appShortName } from "./_document";

const Home: NextPage = () => {
    return (<PageTransition>
        <Helmet>
            <title>{appShortName}</title>
        </Helmet>
    </PageTransition>)
}

export default Home
