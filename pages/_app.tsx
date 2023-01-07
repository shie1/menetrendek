import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import { MantineProvider, Container, Divider, Stack, Title, Text, Affix, Alert, Button, Group, Transition, Progress } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { IconLayout, IconSearch, IconShare, IconApps, IconRotateClockwise, IconDownload, IconCash } from '@tabler/icons';
import { FeaturesGrid } from '../components/hello';
import { QuickMenu } from '../components/menu';
import { motion, AnimatePresence } from "framer-motion"
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';
import { useMediaQuery } from '@mantine/hooks';
import { useCookies } from 'react-cookie';
import { useUserAgent } from '../components/ua';
import { appShortName } from './_document';
import { useRouter } from 'next/dist/client/router';
import { SEO } from '../components/seo';
import { apiCall } from '../components/api';
import { LocalizedStrings } from './api/localization';
import App from 'next/app';

export const OneMenu = createContext<{ oneMenu: number, setOneMenu: (a: number) => void }>({ oneMenu: 0, setOneMenu: () => { } })

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

function MyApp({ Component, pageProps, strings }: AppProps & { strings: LocalizedStrings }) {
  const ua = useUserAgent()
  const router = useRouter()
  const [dlVisible, setDlVisible] = useState(false)
  const [oneMenu, setOneMenu] = useState(0)
  const [prompt, setPropmt] = useState<Event & any | undefined>()
  const touchscreen = useMediaQuery("(max-width: 580px)")
  const [selection, setSelection] = useState<Selection>({ to: undefined, from: undefined })
  const [input, setInput] = useState<Input>({ to: "", from: "" })
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks', 'no-page-transitions', 'action-timeline-type', 'route-limit', 'use-route-limit', 'calendar-service', 'blip-limit', "install-declined", "language"]);
  const [goal, setGoal] = useState<any>()

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
      if (typeof cookies['language'] === 'undefined') {
        setCookie("language", 'hu', { path: '/', maxAge: 60 * 60 * 24 * 365 })
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
    if (prompt && cookies["install-declined"] === "false") {
      setDlVisible(true)
    }
  }, [prompt, cookies])

  useEffect(() => {
    const handler = (e: Event & any) => {
      e.preventDefault()
      setPropmt(e)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener("beforeinstallprompt", handler)
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  useEffect(() => {
    apiCall("GET", "/api/goal").then(setGoal)
  }, [])

  pageProps = {
    ...pageProps,
    strings,
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
        <Header links={[{ label: strings.map, link: "/map" }, { label: strings.settings, link: "/settings" }]} />
        <OneMenu.Provider value={{ oneMenu, setOneMenu }}>
          <Input.Provider value={{ selection, setSelection, input, setInput }}>
            <Container aria-current="page" fluid={router.pathname === "/map"} p={router.pathname === "/map" ? 0 : 'md'}>
              <AnimatedLayout>
                {router.pathname === "/map" ? <></> : <QuickMenu strings={strings} />}
                <AnimatePresence mode='wait'>
                  <Component {...pageProps} />
                </AnimatePresence>
                {router.pathname === "/map" ? <></> : <div role="region" aria-label='Funkciók'>
                  <Divider size="md" my="md" />
                  <Stack pb="xl" spacing={3}>
                    <Title order={1} size={36}>Menetrendek</Title>
                    <Title mt={-8} style={{ fontSize: '1.4rem' }} color="dimmed" order={2}>{strings.slogan}</Title>
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
                        </a>{i === arr.length - 2 ? ` ${strings.and} ` : i + 1 !== arr.length ? ", " : " "}</span>)
                      })}
                      {strings.timetables}
                    </Title>
                    <Text style={{ fontSize: '1rem' }} color="dimmed" weight={600}>{strings.wereBetterAt}</Text>
                  </Stack>
                  <FeaturesGrid
                    data={[
                      { title: strings.interface, icon: IconLayout, description: strings.interfaceSubtext },
                      { title: strings.quickAccess, icon: IconSearch, description: strings.quickAccesSubtext },
                      { title: strings.share, icon: IconShare, description: strings.shareSubtext },
                      { title: strings.pwaSupport, icon: IconApps, description: strings.pwaSupportSubtext },
                      { title: strings.activeDevelopment, icon: IconRotateClockwise, description: strings.activeDevelopmentSubtext },
                    ]}
                  />
                  {!goal ? <></> : <><Divider size="md" my="md" /><Stack>
                    <Group sx={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap" }}>
                      <Stack spacing={0} sx={{ flex: 4, minWidth: 300 }}>
                        <Title size={30} weight={700} order={3}>{strings.donationGoal}</Title>
                        <Title size={20} mt={-4} order={4}>{goal?.title} | ${goal?.goal}</Title>
                      </Stack>
                      <Text component='p' sx={{ lineHeight: 1.6, margin: 0, flex: 8, flexBasis: 445 }}>{goal?.description}</Text>
                    </Group>
                    <Progress radius="xl" size="xl" value={goal?.percentage} />
                    <Group position='right'>
                      <Text>{strings.donateXofY.replace('{0}', goal?.percentage).replace('{1}', goal?.goal)}</Text>
                      <Button component='a' href='https://ko-fi.com/menetrendekinfo' target="_blank" rel="external noreferrer" leftIcon={<IconCash />}>{strings.donate}</Button>
                    </Group>
                  </Stack></>}
                </div>}
              </AnimatedLayout>
            </Container>
            <Affix sx={{ width: '100vw' }}>
              <Transition transition="slide-up" mounted={dlVisible && touchscreen}>
                {(styles) => (<Alert role="alert" p="lg"
                  styles={{
                    root: { border: 0 },
                    closeButton: { scale: '1.5', top: 20 }
                  }}
                  radius={0} onClose={() => {
                    setDlVisible(false)
                    setCookie("install-declined", 'true', { path: '/', maxAge: 60 * 60 * 24 * 365 })
                  }} style={styles} variant='outline' icon={<IconDownload />} title={strings.downloadTheApp} withCloseButton>
                  <Stack>
                    <Text>
                      {strings.downloadPitch}
                    </Text>
                    <Button role="button" aria-label={strings.downloadApp} onClick={() => {
                      prompt.prompt().then(({ outcome }: any) => {
                        if (outcome === "accepted") {
                          setDlVisible(false)
                        }
                      })
                    }} leftIcon={<IconDownload />}>
                      {strings.download}
                    </Button>
                  </Stack>
                </Alert>)}
              </Transition>
            </Affix>
          </Input.Provider>
        </OneMenu.Provider>
        <Footer data={[]} strings={strings} />
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

MyApp.getInitialProps = async (context: any) => {
  const pageProps = await App.getInitialProps(context);
  let props: any = { ...pageProps }
  const subdomain = context.ctx.req?.headers.host.split('.')[0] || "";
  const lang = subdomain === "en" ? "en" : "hu"
  props.strings = await apiCall("POST", (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info") + "/api/localization", { lang: lang })
  return props
}

export default MyApp
