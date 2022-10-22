import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Box,
  Card,
  Center,
  Container,
  Group,
  Title,
  Switch,
  Text,
  ActionIcon,
  Space,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { IconSun, IconMoonStars, IconBrandYoutube, IconWorld } from '@tabler/icons';
import { useMantineTheme } from '@mantine/styles';
import { NotificationsProvider } from '@mantine/notifications';
import Link from 'next/link';
import { interactive } from '../components/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useMantineTheme()
  const [firstStart, setFirstStart] = useLocalStorage<boolean>({ key: 'first-start', defaultValue: true })
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme', defaultValue: 'dark' })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['ctrl+J', () => toggleColorScheme()]])

  return (<>
    <Head>
      <title>Menetrendek</title>
    </Head>
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{
        colorScheme: colorScheme,
        primaryColor: 'grape',
        primaryShade: 8,
        fontFamily: 'Sora, sans-serif',
      }} >
        <NotificationsProvider>
          <div className='bg' />
          <Container tabIndex={-1} sx={{ height: '100vh' }}>
            <Center sx={{ height: '100%' }}>
              <Box p='sm' sx={{ width: 500, height: '100%' }}>
                <Card radius="lg" shadow='xl' sx={{ minHeight: '100%', position: 'relative' }}>
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
                  <Space h="xl" />
                  <Group my={6} spacing={0} position='center' align="center" sx={{ bottom: 0, position: 'absolute', width: '94%' }}>
                    <ActionIcon onClick={() => window.open("https://shie1bi.hu", "_blank")}>
                      <IconWorld size={16} />
                    </ActionIcon>
                    <Text size="sm">Shie1bi, {(new Date()).getFullYear()}</Text>
                    <ActionIcon onClick={() => window.open("https://youtube.com/shie1bi", "_blank")}>
                      <IconBrandYoutube size={16} />
                    </ActionIcon>
                  </Group>
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
