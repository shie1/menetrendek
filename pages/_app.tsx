import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  MantineProvider,
  Box,
  Card,
  Center,
  Container,
  Group,
  Title,
  ActionIcon,
  Stack,
  Divider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { IconChevronUp } from '@tabler/icons';
import { useMantineTheme } from '@mantine/styles';
import { NotificationsProvider } from '@mantine/notifications';
import Link from 'next/link';
import { interactive } from '../components/styles';
import Head from 'next/head';
import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/dist/client/router';
import Script from "next/script"
import { SearchSection } from '../components/menu';
import { Stop } from '../components/stops';
import { AnimatePresence, motion } from "framer-motion";

export const Dev = createContext<Array<boolean | any>>([false, () => { }])
export const Time = createContext<any>([null, () => { }])
export const Input = createContext<any>([])
export const GeoPerms = createContext<any>(false)

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useMantineTheme()
  const [input, setInput] = useState<{ from: Stop; to: Stop; }>()
  const [dev, setDev] = useLocalStorage({ defaultValue: false, key: 'developer-mode' })
  const [cookies, setCookie, removeCookie] = useCookies(['primary-color']);
  const [time, setTime] = useState<any>(null)
  const [geoPerms, setGeoPerms] = useState(false)
  const router = useRouter()
  const [search, setSearch] = useState(true)

  useHotkeys([
    ['ctrl+D', () => setDev(!dev)],
    ['Enter', () => window.dispatchEvent(new Event("search-trigger"))],
    ['ctrl+K', () => setSearch(!search)]
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.permissions.query({ name: 'geolocation' }).then(geo => {
        geo.addEventListener("change", (e) => {
          setGeoPerms((e.currentTarget as PermissionStatus).state === "granted")
        })
        if (geo.state !== 'granted') {
          navigator.geolocation.getCurrentPosition(() => { })
        } else {
          setGeoPerms(true)
        }
      })
    }
    return () => {
      navigator.permissions.query({ name: 'geolocation' }).then(geo => {
        geo.removeEventListener("change", (e) => {
          setGeoPerms((e.currentTarget as PermissionStatus).state === "granted")
        })
      })
    }
  }, [])

  return (<>
    <Head>
      <title>Menetrendek</title>
    </Head>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{
      colorScheme: 'dark',
      primaryColor: 'grape',
      primaryShade: 8,
      fontFamily: 'Sora, sans-serif',
    }} >
      <NotificationsProvider>
        <Dev.Provider value={[dev, setDev]}>
          <Time.Provider value={[time, setTime]}>
            <Input.Provider value={[input, setInput]}>
              <GeoPerms.Provider value={geoPerms}>
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
                <Container aria-current="page" sx={{ height: '100vh' }}>
                  <Center sx={{ height: '-webkit-fill-available' }}>
                    <Box p='sm' sx={{ width: 500, height: '-webkit-fill-available' }}>
                      <Card p="md" radius="lg" shadow='xl' sx={{ height: '-webkit-fill-available', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <Group id='app-header' position='apart' mb='md'>
                          <Link href="/"><Group sx={interactive}><Title order={router.pathname === "/" ? 2 : 1} size={32}>Menetrendek</Title></Group></Link>
                          <Group position="center">
                            <motion.div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} animate={{ rotate: search ? 0 : 180 }}>
                              <ActionIcon onClick={() => setSearch(!search)} variant="filled" color={theme.primaryColor} size="lg" radius="xl">
                                <IconChevronUp size={50} />
                              </ActionIcon>
                            </motion.div>
                          </Group>
                        </Group>
                        <Stack id='app-main' sx={{ overflow: 'visible', display: 'flex', height: '100%' }}>
                          <AnimatePresence>
                            {search &&
                              <motion.div animate={{ opacity: 1, transform: 'scaleY(100%) translateY(0%)' }} exit={{ opacity: 0, transform: 'scaleY(0%) translateY(-50%)' }} initial={{ opacity: 0, transform: 'scaleY(0%) translateY(-50%)' }} transition={{ duration: .2 }}>
                                <Stack sx={{ width: '-webkit-fill-available' }}>
                                  <SearchSection />
                                  <Divider mb='sm' size="md" />
                                </Stack>
                              </motion.div>}
                          </AnimatePresence>
                          <Stack sx={{ flexGrow: 1, marginBottom: '14%', overflowY: 'auto' }}>
                            <Component {...pageProps} />
                          </Stack>
                        </Stack>
                      </Card>
                    </Box>
                  </Center>
                </Container>
              </GeoPerms.Provider>
            </Input.Provider>
          </Time.Provider>
        </Dev.Provider>
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
