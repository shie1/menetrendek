import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, Container, Divider, Stack, Title, Text, Affix, Alert, Button, Group, Transition } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { IconLayout, IconSearch, IconShare, IconApps, IconRotateClockwise, IconDownload } from '@tabler/icons';
import { FeaturesGrid } from '../components/hello';
import { QuickMenu } from '../components/menu';
import { motion, AnimatePresence } from "framer-motion"
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { useCookies } from 'react-cookie';
import { useUserAgent } from '../components/ua';
import { appRoot, appShortName } from './_document';
import { useRouter } from 'next/dist/client/router';
import { SEO } from '../components/seo';

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
  user?: {
    discount: number;
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
  return (cookies["no-page-transitions"] === "true" ? <main role="main">{children}</main> : <main role="main"><motion.div layout>{children}</motion.div></main>)
}

function MyApp({ Component, pageProps }: AppProps) {
  const ua = useUserAgent()
  const router = useRouter()
  const [dlVisible, setDlVisible] = useState(false)
  const [prompt, setPropmt] = useState<Event & any | undefined>()
  const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")
  const [selection, setSelection] = useState<Selection>({ to: undefined, from: undefined })
  const [input, setInput] = useState<Input>({ to: "", from: "" })
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions', 'action-timeline-type', 'route-limit', 'use-route-limit', 'calendar-service', 'blip-limit', "install-declined"]);

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
      if (typeof cookies['blip-limit'] === 'undefined') {
        setCookie("blip-limit", '25', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
      if (typeof cookies['install-declined'] === 'undefined') {
        setCookie("install-declined", 'false', { path: '/', maxAge: 60 * 60 * 24 * 365 })
      }
    }
  }, [cookies, ua])

  useEffect(() => {
    const handler = (e: any) => { if (e.key === "Shift" || e.key === "Tab" || e.key === "Alt") e.preventDefault() }
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handler)
    }
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    const handler = (e: Event & any) => {
      e.preventDefault()
      setPropmt(e)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener("beforeinstallprompt", handler)
      setDlVisible(true)
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  pageProps = {
    ...pageProps,
    prompt
  }

  return (<>
    <SEO>
      <title>{appShortName}</title>
    </SEO>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{
      colorScheme: 'dark',
      primaryColor: 'indigo',
      primaryShade: 7,
      fontFamily: 'Sora, sans-serif',
    }} >
      <NotificationsProvider>
        <div className='bg' />
        <Header links={[{ label: "Térkép", link: "/map" }, { label: "Beállítások", link: "/settings" }]} />
        <Input.Provider value={{ selection, setSelection, input, setInput }}>
          <Container aria-current="page" fluid={router.pathname === "/map"} p={router.pathname === "/map" ? 0 : 'md'}>
            <AnimatedLayout>
              {router.pathname === "/map" ? <></> : <QuickMenu />}
              <AnimatePresence mode='wait'>
                <Component {...pageProps} />
              </AnimatePresence>
              {router.pathname === "/map" ? <></> : <div role="region" aria-label='Funkciók'>
                <Divider size="md" my="md" />
                <Stack pb="xl" spacing={3}>
                  <Title order={1} size={36}>Menetrendek</Title>
                  <Title mt={-8} style={{ fontSize: '1.4rem' }} color="dimmed" order={2}>A modern menetrend kereső</Title>
                  <Title mt={-2} color="dimmed" style={{ fontSize: '1.1rem' }} order={3} >
                    {[
                      { label: "MÁV", link: "https://mav.hu" },
                      { label: "Volánbusz", link: "https://volanbusz.hu" },
                      { label: "BKK", link: "https://bkk.hu" },
                      { label: "GYSEV", link: "https://gysev.hu" },
                      { label: "MAHART", link: "https://mahart.hu" },
                      { label: "BAHART", link: "https://bahart.hu" }
                    ].map((item, i, arr) => {
                      return (<span key={i}><a rel='external noreferrer' role="link" aria-label={item.label} href={item.link} target="_blank">
                        {item.label}
                      </a>{i === arr.length - 2 ? " és " : i + 1 !== arr.length ? ", " : " "}</span>)
                    })}
                    menetrendek
                  </Title>
                  <Text style={{ fontSize: '1rem' }} color="dimmed" weight={600}>Íme néhány dolog, amiben egyszerűen jobbak vagyunk:</Text>
                </Stack>
                <FeaturesGrid
                  data={[
                    { title: "Kezelőfelület", icon: IconLayout, description: "Modern, letisztult és mobilbarát kezelőfelület." },
                    { title: "Gyors elérés", icon: IconSearch, description: "Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe." },
                    { title: "Megosztás", icon: IconShare, description: "Útvonaltervek gyors megosztása kép formájában." },
                    { title: "PWA támogatás", icon: IconApps, description: "Ez a weboldal egy PWA (progresszív webalkalmazás), így könnyen letöltheted alkalmazásként a telefonodra." },
                    { title: "Aktív fejlesztés", icon: IconRotateClockwise, description: "A weboldal szinte minden héten frissül. A funkciók folyamatosan bővülnek és a hibák folyamatosan javítva vannak." },
                  ]}
                />
              </div>}
            </AnimatedLayout>
          </Container>
          <Affix sx={{ width: '100vw' }}>
            <Transition transition="slide-up" mounted={dlVisible && prompt && touchscreen && cookies["install-declined"] === "false"}>
              {(styles) => (<Alert role="alert" p="lg"
                styles={{
                  root: { border: 0 },
                  closeButton: { scale: '1.5', top: 20 }
                }}
                radius={0} onClose={() => {
                  setDlVisible(false)
                  setCookie("install-declined", 'true', { path: '/', maxAge: 60 * 60 * 24 * 365 })
                }} style={styles} variant='outline' icon={<IconDownload />} title="Töltsd le az alkalmazást!" withCloseButton>
                <Stack>
                  <Text>
                    Töltsd le a Menetrendek alkalmazást, hogy könnyen és gyorsan hozzáférj a menetrendekhez, a böngésződ megnyitása nélkül!
                  </Text>
                  <Button role="button" aria-label="Alkalmazás letöltése" onClick={() => {
                    prompt.prompt().then(({ outcome }: any) => {
                      if (outcome === "accepted") {
                        setDlVisible(false)
                      }
                    })
                  }} leftIcon={<IconDownload />}>
                    Letöltés
                  </Button>
                </Stack>
              </Alert>)}
            </Transition>
          </Affix>
        </Input.Provider>
        <Footer data={[{ title: "Támogatás", links: [{ label: "Paypal.me", link: "https://paypal.me/shie1bi" }] }]} />
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
