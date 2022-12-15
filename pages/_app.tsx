import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, Container, Divider, Stack, Title, Text, Affix, ActionIcon, Transition } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
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
import { useUserAgent } from '../components/ua';

export interface Input {
  from: Stop | undefined;
  to: Stop | undefined;
}
export type InputSetter = (a: Input) => void

export interface Query extends Input {
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

export const Input = createContext<{ input: Input, setInput: InputSetter }>({ input: { from: undefined, to: undefined }, setInput: () => { } })

export const AnimatedLayout = ({ children }: { children: any }) => {
  const [cookies] = useCookies(["no-page-transitions"])
  return (cookies["no-page-transitions"] === "true" ? children : <motion.div layout>{children}</motion.div>)
}

function MyApp({ Component, pageProps }: AppProps) {
  const ua = useUserAgent()
  const [query, setQuery] = useState<Query | undefined>()
  const [input, setInput] = useState<Input>({ to: undefined, from: undefined })
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions', 'action-timeline-type', 'route-limit', 'use-route-limit']);
  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => { //Initialize cookies
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
  }, [cookies])

  useEffect(() => {
    const handler = (e: any) => { if (e.key === "Shift" || e.key === "Tab" || e.key === "Alt") e.preventDefault() }
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
        <div className='bg' />
        <Header links={[{ label: "Beállítások", link: "/settings" }]} />
        <Input.Provider value={{ input, setInput }}>
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
        </Input.Provider>
        <Footer data={[{ title: "Támogatás", links: [{ label: "Paypal.me", link: "https://paypal.me/shie1bi" }] }]} />
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
