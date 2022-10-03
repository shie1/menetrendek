import type { NextPage } from "next";
import { Head, NextScript, Main, Html } from "next/document";
import { useMantineTheme } from "@mantine/core";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const appName = "Menetrendek"
const appDesc = "Helyközi menetrend kereső"
const appRoot = "https://menetrendek.shie1bi.hu/"
const appThumb = "/img/preview.jpg"

const Document: NextPage = () => {
    const theme = useMantineTheme()
    const router = useRouter()
    const [appUrl, setAppUrl] = useState(appRoot)

    useEffect(() => {
        setAppUrl(appRoot + router.pathname)
    }, [router])

    return (<Html lang="hu">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
            <link rel='icon' type="image/x-icon" href='/favicon.ico' />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="manifest" href="/api/manifest.webmanifest" />
            <meta name="theme-color" content="#9C36B5" />
            <link rel='canonical' href={appUrl} />

            <meta name="title" content={appName} />
            <meta name="description" content={appDesc} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={appUrl} />
            <meta property="og:title" content={appName} />
            <meta property="og:description" content={appDesc} />
            <meta property="og:image" content={appThumb} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={appUrl} />
            <meta property="twitter:title" content={appName} />
            <meta property="twitter:description" content={appDesc} />
            <meta property="twitter:image" content={appThumb} />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>)
}

export default Document