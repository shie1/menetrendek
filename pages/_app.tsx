import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, Container } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Head from 'next/head';
import Script from "next/script"
import { Footer } from '../components/footer';
import { Header } from '../components/header';

function MyApp({ Component, pageProps }: AppProps) {

  return (<>
    <Head>
      <title>Menetrendek</title>
    </Head>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{
      colorScheme: 'dark',
      primaryColor: 'indigo',
      primaryShade: 9,
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
        <Header links={[{ label: "Főoldal", link: "/" }, { label: "Kereső", link: "/search" }]} />
        <Container aria-current="page">
          <Component {...pageProps} />
        </Container>
        <Footer data={[]} />
      </NotificationsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
