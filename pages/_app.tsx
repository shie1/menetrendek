import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { Box, Container, LoadingOverlay, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { appShortName } from './_document';
import { SEO } from '../components/seo';
import { NavbarMinimal } from '../components/nav';
import { IconArrowsUpDown, IconBrandGithub, IconBuilding, IconCoin, IconHome, IconMap, IconSearch, IconSettings, IconStar } from '@tabler/icons';
import { SpotlightProvider, openSpotlight } from "@mantine/spotlight"
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { createContext, useEffect, useState } from 'react';
import { Stop } from '../components/stops';

export interface Selection {
  from: Stop | undefined;
  to: Stop | undefined;
}
export interface Input {
  from: string;
  to: string;
}
export const Input = createContext<{ selection: Selection, setSelection: (a: Selection) => void, input: Input, setInput: (a: Input) => void }>({ selection: { from: undefined, to: undefined }, setSelection: () => { }, input: { from: "", to: "" }, setInput: () => { } })

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)
  const mobileBreakpoint = useMediaQuery("(max-width: 600px)")
  const [[selection, setSelection], [input, setInput]] = [useState<Selection>({ to: undefined, from: undefined }), useState<Input>({ to: "", from: "" })]

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
            "title": "Útvonalterv készítése",
            icon: <IconArrowsUpDown />,
            onTrigger: () => { router.push("/#search-routes") },
          },
          {
            "title": "Forráskód (GitHub)",
            icon: <IconBrandGithub />,
            onTrigger: () => { window.open("https://github.com/shie1/menetrendek", "_blank", "noopener,noreferrer") },
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
            <div className='bg' style={{backgroundImage: 'url("/api/img/bg.jpg?s=2000")'}} />
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
              <LoadingOverlay overlayOpacity={.5} loaderProps={{ size: "lg" }} style={{ zIndex: '99 !import' }} visible={pageLoading} />
              <Container p="lg" pt="xl">
                <Component {...pageProps} />
              </Container>
            </Box>
          </Input.Provider>
        </NotificationsProvider>
      </SpotlightProvider>
    </MantineProvider>
  </>)
}

export default MyApp