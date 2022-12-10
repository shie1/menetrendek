import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, Container, Divider, Stack, Title, Text, Affix, ActionIcon, Transition } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import Script from "next/script"
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { IconLayout, IconSearch, IconShare, IconApps, IconRotateClockwise, IconArrowUp } from '@tabler/icons';
import { FeaturesGrid } from '../components/hello';
import { QuickMenu } from '../components/menu';
import { motion, AnimatePresence } from "framer-motion"
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';
import { useWindowScroll } from '@mantine/hooks';
import { useCookies } from 'react-cookie';

export interface Query {
  from: Stop;
  to: Stop;
  time: {
    hours: number;
    minutes: number;
    date: string;
  }
  user: {
    discount: number;
    networks: Array<number>;
  },
  index?: number;
}
export type QuerySetter = (a: Query) => void

export const Query = createContext<{ query: Query | undefined; setQuery: QuerySetter }>({ query: undefined, setQuery: () => { } })

function MyApp({ Component, pageProps }: AppProps) {
  const [query, setQuery] = useState<Query | undefined>()
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    if (!cookies["selected-networks"] || cookies["selected-networks"].findIndex((item: string) => item === '10,24') !== -1) {
      setCookie("selected-networks", ['1', '2', '25', '3', '10', '24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
  }, [cookies])

  useEffect(() => {
    const handler = (e: any) => { if (e.key === "Shift" || e.key === "Tab") e.preventDefault() }
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handler)
    }
    return () => window.removeEventListener("keydown", handler)
  })

  return (<>
    <Head>
      <title>Menetrendek</title>
    </Head>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{
      colorScheme: 'dark',
      primaryColor: 'indigo',
      primaryShade: 7,
      fontFamily: 'Sora, sans-serif',
    }} >
      <NotificationsProvider>
        <div id='google-analytics-container'>
          <Script strategy='afterInteractive' src='https://www.googletagmanager.com/gtag/js?id=G-7E6FQCCW4D' />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
          
              gtag('config', 'G-7E6FQCCW4D');
            `}
          </Script>
        </div>
        <div className='bg' />
        <Header links={[]} />
        <Query.Provider value={{ query, setQuery }}>
          <Container aria-current="page">
            <motion.div layout>
              <QuickMenu />
              <AnimatePresence mode='wait'>
                <Component {...pageProps} />
              </AnimatePresence>
              <Divider size="md" my="md" />
              <Stack pb="xl" spacing={3}>
                <Title>Menetrendek</Title>
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
            </motion.div>
          </Container>
          <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 320}>
              {(transitionStyles) => (
                <ActionIcon
                  variant='filled'
                  color="blue"
                  radius="xl"
                  size="lg"
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  <IconArrowUp size={25} />
                </ActionIcon>
              )}
            </Transition>
          </Affix>
        </Query.Provider>
        <Footer data={[{ title: "", links: [{ label: "Támogatás", link: "https://paypal.me/shie1bi" }] }]} />
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
