import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { Box, Container, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { appShortName } from './_document';
import { SEO } from '../components/seo';
import { NavbarMinimal } from '../components/nav';
import { IconArrowsUpDown, IconBrandGithub, IconBuilding, IconCoin, IconHome, IconMap, IconSearch, IconSettings, IconStar } from '@tabler/icons';
import { SpotlightProvider, openSpotlight } from "@mantine/spotlight"
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const mobileBreakpoint = useMediaQuery("(max-width: 600px)")

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
            onTrigger: () => { },
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
        <NotificationsProvider>
          <div className='bg' />
          <NavbarMinimal doBreak={mobileBreakpoint} data={[
            {
              icon: IconSearch,
              label: 'Keresés',
              href: '#',
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
          <Box ml={mobileBreakpoint ? 0 : 80} mb={mobileBreakpoint ? 80 : 0}>
            <Container p="lg" mt="xl">
              <Component {...pageProps} />
            </Container>
          </Box>
        </NotificationsProvider>
      </SpotlightProvider>
    </MantineProvider>
  </>)
}

export default MyApp
