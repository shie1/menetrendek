import type { NextPage } from "next";
import { NextScript, Main, Html, Head } from "next/document";
import { useMantineTheme } from "@mantine/core";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Script from "next/script";

export const appShortName = "Menetrendek"
export const appName = "Menetrendek - A modern menetrend kereső"
export const appDesc = "MÁV, Volánbusz, BKK, GYSEV, MAHART, BAHART"
export const appRoot = "https://menetrendek.info"
export const appThumb = ""

const Document: NextPage = () => {
    const theme = useMantineTheme()
    const router = useRouter()

    return (<Html lang="hu">
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel='apple-touch-icon' href='/api/img/logo.png?s=180' />
            <link rel='icon' type="image/x-icon" href='/favicon.ico' />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="manifest" href="/api/manifest.webmanifest" />
            <meta name="theme-color" content="#396be1" />

            <meta name="title" content={appName} />
            <meta name="description" content={appDesc} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={appName} />
            <meta property="og:description" content={appDesc} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={appName} />
            <meta property="twitter:description" content={appDesc} />

            {!appThumb ? <></> : <>
                <meta property="og:image" content={appThumb} />
                <meta property="twitter:image" content={appThumb} />
            </>}

            <Script // Adsense
                id="Adsense-id"
                async
                strategy="beforeInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3057716180157458"
            />

            <Script id="google-tag-manager" strategy="afterInteractive" /*Google tag manager*/>
                {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MVHLMXV');
                `}
            </Script>
        </Head>
        <body>
            <Main />
            <NextScript />
            <noscript
                dangerouslySetInnerHTML={{
                    __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MVHLMXV" height="0" width="0" style="display: none; visibility: hidden;" />`,
                }}
            />
        </body>
    </Html >)
}

export default Document