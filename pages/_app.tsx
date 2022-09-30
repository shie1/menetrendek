import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ColorScheme, ColorSchemeProvider, MantineProvider, Box, Card, Center, Container, Group, Title, Switch } from '@mantine/core'
import { useHotkeys, useLocalStorage, useColorScheme } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconSun, IconMoonStars } from '@tabler/icons';
import { useMantineTheme } from '@mantine/styles';
import { NotificationsProvider } from '@mantine/notifications';
import Link from 'next/link';
import { interactive } from '../components/styles';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useMantineTheme()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme', defaultValue: useColorScheme() })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['ctrl+J', () => toggleColorScheme()]])

  return (<>
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{
        colorScheme, colors: {
          'prettyblue': ['#6eb6ff', '#7dbdff', '#8bc5ff', '#9accff', '#a8d3ff', '#b7dbff', '#c5e2ff', '#d4e9ff', '#e2f0ff', '#f1f8ff']
        },
        primaryColor: 'prettyblue',
        primaryShade: 0,
        fontFamily: 'Sora, sans-serif',
      }} >
        <NotificationsProvider>
          <Container my='sm'>
            <Center sx={{ minHeight: '97vh' }}>
              <Box sx={{ width: 500 }}>
                <Card radius="lg" shadow='xl' sx={{ minHeight: '97vh' }}>
                  <Group position='apart' mb='md'>
                    <Link href="/"><Group sx={interactive}><Title>Menetrendek</Title></Group></Link>
                    <Group position="center">
                      <Switch
                        checked={colorScheme === 'dark'}
                        onChange={() => toggleColorScheme()}
                        size="lg"
                        onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
                        offLabel={<IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />}
                      />
                    </Group>
                  </Group>
                  <Component {...pageProps} />
                </Card>
              </Box>
            </Center>
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  </>)
}

export default MyApp
