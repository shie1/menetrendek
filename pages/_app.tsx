import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { Affix, Alert, Box, Button, Container, LoadingOverlay, MantineProvider, Stack, Text, Transition } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { appShortName } from './_document';
import { SEO } from '../components/seo';
import { NavbarMinimal } from '../components/nav';
import { IconArrowsUpDown, IconBrandGithub, IconBuilding, IconCalendar, IconCoin, IconDiscount, IconDownload, IconHome, IconMap, IconSearch, IconSettings, IconStar } from '@tabler/icons';
import { SpotlightProvider, openSpotlight } from "@mantine/spotlight"
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';
import { useCookies } from 'react-cookie';
import { useUserAgent } from '../components/ua';

export interface Selection {
  from: Stop | undefined;
  to: Stop | undefined;
}
export interface Input {
  from: string;
  to: string;
}
export const Input = createContext<{ selection: Selection, setSelection: (a: Selection) => void, input: Input, setInput: (a: Input) => void }>({ selection: { from: undefined, to: undefined }, setSelection: () => { }, input: { from: "", to: "" }, setInput: () => { } })
export const MenuHandler = createContext<{ menuOpen: number, setMenuOpen: (a: number) => void }>({ menuOpen: -1, setMenuOpen: () => { } })

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)
  const mobileBreakpoint = useMediaQuery("(max-width: 600px)")
  const [[selection, setSelection], [input, setInput]] = [useState<Selection>({ to: undefined, from: undefined }), useState<Input>({ to: "", from: "" })]
  const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'calendar-service', 'install-declined'])
  const ua = useUserAgent()
  const [dlVisible, setDlVisible] = useState(false)
  const [prompt, setPropmt] = useState<Event & any | undefined>()
  const touchscreen = useMediaQuery("(max-width: 580px)")
  const [menuOpen, setMenuOpen] = useState(-1)

  useEffect(() => { // Init cookies
    if (typeof cookies['discount-percentage'] === "undefined") setCookie('discount-percentage', 0, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['calendar-service'] === "undefined") setCookie('calendar-service', ua?.device.vendor === "Apple" ? '5' : '1', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['install-declined'] === "undefined") setCookie("install-declined", 'false', { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }, [cookies])

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
    router.events.on('routeChangeStart', () => setPageLoading(true))
    router.events.on('routeChangeComplete', () => setPageLoading(false))
    router.events.on('routeChangeError', () => setPageLoading(false))
    return () => {
      router.events.off('routeChangeStart', () => setPageLoading(true))
      router.events.off('routeChangeComplete', () => setPageLoading(false))
      router.events.off('routeChangeError', () => setPageLoading(false))
    }
  })

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
      <SpotlightProvider
        styles={{
          root: {
            padding: "10px"
          }
        }}
        actions={[
          {
            title: "Főoldal",
            icon: <IconHome />,
            onTrigger: () => { router.push("/") },
          },
          {
            title: "Városok",
            icon: <IconBuilding />,
            onTrigger: () => { router.push("/cities") },
          },
          {
            "title": "Beállítások",
            icon: <IconSettings />,
            onTrigger: () => { router.push("/settings") },
          },
          {
            title: "Útvonalterv készítése",
            icon: <IconArrowsUpDown />,
            onTrigger: () => { router.push("/") },
          },
          {
            title: "Kedvezmény beállítása",
            icon: <IconDiscount />,
            onTrigger: () => { router.push("/settings#discount") },
          },
          {
            title: "Naptár alkalmazás kiválasztása",
            icon: <IconCalendar />,
            onTrigger: () => { router.push("/settings#calendar") },
          },
          {
            title: "Támogatás (Ko-Fi)",
            icon: <IconCoin />,
            onTrigger: () => { window.open("https://ko-fi.com/menetrendekinfo", "_blank", "noopener,noreferrer") },
          }
        ]}
        radius="lg"
        onChange={() => { }}
      >
        <NotificationsProvider position='top-center'>
          <Input.Provider value={{ selection, setSelection, input, setInput }}>
            <MenuHandler.Provider value={{ menuOpen, setMenuOpen }}>
              <div className='bg' style={{ backgroundImage: 'url("/api/img/bg.jpg?s=2000")' }} />
              <NavbarMinimal doBreak={mobileBreakpoint} data={[
                {
                  icon: IconSearch,
                  label: 'Keresés',
                  onClick: openSpotlight,
                },
                {
                  icon: IconHome,
                  label: 'Főoldal',
                  href: '/',
                },
                {
                  icon: IconMap,
                  label: 'Térkép',
                  href: '/map',
                },
                {
                  icon: IconBuilding,
                  label: 'Városok',
                  href: '/cities',
                },
                {
                  icon: IconSettings,
                  label: 'Beállítások',
                  href: '/settings',
                }
              ]} />
              <Box ml={mobileBreakpoint ? 0 : 80} mb={mobileBreakpoint ? 80 : 0} pt="xl" sx={{ position: "relative", minHeight: !mobileBreakpoint ? '100vh' : 'calc(100vh - 80px)', width: mobileBreakpoint ? '100%' : 'calc(100% - 80px)' }}>
                <LoadingOverlay overlayOpacity={.5} loaderProps={{ size: "lg" }} style={{ zIndex: '99 !import', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} visible={pageLoading} />
                <Container p="lg" pt="xl">
                  <Component {...pageProps} />
                </Container>
              </Box>
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
                    }} style={styles} variant='outline' icon={<IconDownload />} title="Töltsd le az alkalmazást!" withCloseButton>
                    <Stack>
                      <Text>
                        Töltsd le az oldalunkat mobiltelefonodon, hogy még egyszerűbben használhasd!
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
            </MenuHandler.Provider>
          </Input.Provider>
        </NotificationsProvider>
      </SpotlightProvider>
    </MantineProvider>
  </>)
}

export default MyApp