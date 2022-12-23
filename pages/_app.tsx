import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, Container, Divider, Stack, Title, Text } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { IconLayout, IconSearch, IconShare, IconApps, IconRotateClockwise } from '@tabler/icons';
import { FeaturesGrid } from '../components/hello';
import { QuickMenu } from '../components/menu';
import { motion, AnimatePresence } from "framer-motion"
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';
import { useWindowScroll } from '@mantine/hooks';
import { useCookies } from 'react-cookie';
import { useUserAgent } from '../components/ua';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { appDesc, appName, appRoot, appShortName, appThumb } from './_document';
import { useRouter } from 'next/dist/client/router';

export interface Selection {
  from: Stop | undefined;
  to: Stop | undefined;
}
export type SelectionSetter = (a: Selection) => void

export interface Input {
  from: string;
  to: string;
}
export type InputSetter = (a: Input) => void

export interface Query extends Selection {
  time: {
    hours: number | undefined;
    minutes: number | undefined;
    date: string;
  }
  user: {
    discount: number;
    networks: Array<number>;
    actionTimelineType?: number
  },
  index?: number;
}
export type QuerySetter = (a: Query | undefined) => void

export interface MyWindow extends Window {
  dataLayer: {
    push: (...a: any) => true
  }
}

export const Input = createContext<{ selection: Selection, setSelection: SelectionSetter, input: Input, setInput: InputSetter }>({ selection: { from: undefined, to: undefined }, setSelection: () => { }, input: { from: "", to: "" }, setInput: () => { } })

export const AnimatedLayout = ({ children }: { children: any }) => {
  const [cookies] = useCookies(["no-page-transitions"])
  return (cookies["no-page-transitions"] === "true" ? children : <motion.div layout>{children}</motion.div>)
}

function MyApp({ Component, pageProps }: AppProps) {
  const ua = useUserAgent()
  const router = useRouter()
  const [query, setQuery] = useState<Query | undefined>()
  const [selection, setSelection] = useState<Selection>({ to: undefined, from: undefined })
  const [input, setInput] = useState<Input>({ to: "", from: "" })
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions', 'action-timeline-type', 'route-limit', 'use-route-limit', 'calendar-service']);
  const [scroll, scrollTo] = useWindowScroll();
  const [appUrl, setAppUrl] = useState(appRoot)

  useEffect(() => {
    setAppUrl(appRoot + router.pathname)
  }, [router])

  useEffect(() => { //Initialize cookies
    if (typeof ua !== 'undefined') {
      if (!cookies["selected-networks"] || cookies["selected-networks"].findIndex((item: string) => item === '10,24') !== -1) {
        setCookie("selected-networks", ['1', '2', '25', '3', '10', '24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies["no-page-transitions"] === 'undefined') {
        setCookie("no-page-transitions", 'false', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies['action-timeline-type'] === 'undefined') {
        setCookie("action-timeline-type", '1', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies['route-limit'] === 'undefined') {
        setCookie("route-limit", '10', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies['use-route-limit'] === 'undefined') {
        setCookie("use-route-limit", 'true', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies['calendar-service'] === 'undefined') {
        setCookie('calendar-service', ua?.device.vendor === "Apple" ? '5' : '1', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
    }
  }, [cookies, ua])

  useEffect(() => {
    const handler = (e: any) => { if (e.key === "Shift" || e.key === "Tab" || e.key === "Alt") e.preventDefault() }
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handler)
    }
    return () => window.removeEventListener("keydown", handler)
  })

  return (<>
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel='apple-touch-icon' href='/api/img/logo.png?s=180' />
        <link rel='icon' type="image/x-icon" href='/favicon.ico' />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="manifest" href="/api/manifest.webmanifest" />
        <meta name="theme-color" content="#396be1" />
        <link rel='canonical' href={appUrl} />

        <meta name="title" content={appName} />
        <meta name="description" content={appDesc} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={appUrl} />
        <meta property="og:title" content={appName} />
        <meta property="og:description" content={appDesc} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={appUrl} />
        <meta property="twitter:title" content={appName} />
        <meta property="twitter:description" content={appDesc} />

        {!appThumb ? <></> : <>
          <meta property="og:image" content={appThumb} />
          <meta property="twitter:image" content={appThumb} />
        </>}
      </Helmet>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{
        colorScheme: 'dark',
        primaryColor: 'indigo',
        primaryShade: 7,
        fontFamily: 'Sora, sans-serif',
      }} >
        <NotificationsProvider>
          <div className='bg' />
          <Header links={[{ label: "Beállítások", link: "/settings" }]} />
          <Input.Provider value={{ selection, setSelection, input, setInput }}>
            <Container aria-current="page">
              <AnimatedLayout>
                <QuickMenu />
                <AnimatePresence mode='wait'>
                  <Component {...pageProps} />
                </AnimatePresence>
                <Divider size="md" my="md" />
                <Stack pb="xl" spacing={3}>
                  <Title order={1} size={36}>Menetrendek</Title>
                  <Title mt={-8} style={{ fontSize: '1.4rem' }} color="dimmed" order={2}>A modern menetrend kereső</Title>
                  <Title mt={-2} color="dimmed" style={{ fontSize: '1.1rem' }} order={3} >MÁV, Volánbusz, BKK, GYSEV, MAHART, BAHART</Title>
                  <Text style={{ fontSize: '1rem' }} color="dimmed" weight={600}>Íme néhány dolog, amiben egyszerűen jobbak vagyunk:</Text>
                </Stack>
                <FeaturesGrid
                  data={[
                    { title: "Kezelőfelület", icon: IconLayout, description: "Modern, letisztult és mobilbarát kezelőfelület." },
                    { title: "Gyors elérés", icon: IconSearch, description: "Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe." },
                    { title: "Megosztás", icon: IconShare, description: "Útvonaltervek gyors megosztása kép formájában." },
                    { title: "PWA támogatás", icon: IconApps, description: "Ez a weboldal egy PWA (progresszív webalkalmazás), így könnyen letöltheted alkalmazásként a telefonodra." },
                    { title: "Aktív fejlesztés", icon: IconRotateClockwise, description: "A weboldal szinte minden héten frissül. A funkciók folyamatosan bővülnek, a hibák folyamatosan keresve és javítva vannak." }
                  ]}
                />
              </AnimatedLayout>
            </Container>
          </Input.Provider>
          <Footer data={[{ title: "Támogatás", links: [{ label: "Paypal.me", link: "https://paypal.me/shie1bi" }] }]} />
        </NotificationsProvider>
      </MantineProvider>
    </HelmetProvider>
  </>)
}

export default MyApp
