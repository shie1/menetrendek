import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  List,
  Menu,
  Paper,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications';
import {
  IconArrowForwardUp,
  IconClock,
  IconX,
  IconSettings,
  IconRotateClockwise2,
  IconArrowBarToRight,
  IconArrowBarRight,
  IconAlertCircle,
  IconInfoCircle,
  IconLayout2,
  IconMoonStars,
  IconSearch,
  IconShare,
  IconApps,
  IconRefresh,
} from '@tabler/icons';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { StopIcon, StopInput } from '../components/stops'
import { dateString } from '../client';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { isEqual } from "lodash";
import { gradientText, interactive } from '../components/styles';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic'
import { apiCall } from '../components/api';

const DiscountSelector = dynamic(() =>
  import('../components/selectors').then((e) => e.DiscountSelector),
  { ssr: false }
)
const NetworksSelector = dynamic(() =>
  import('../components/selectors').then((e) => e.NetworksSelector),
  { ssr: false }
)

const MyThemeIcon = ({ icon }: { icon: any }) => {
  const theme = useMantineTheme()
  return <ThemeIcon radius="xl" variant="gradient" gradient={{ from: theme.primaryColor, to: 'blue' }}>{createElement(icon, { size: 20 })}</ThemeIcon>
}

const Input = createContext<any>([])

const Stop = ({ value, network, id, sid, remove }: { value: string, network: Number, id: number, sid: number, remove: any }) => {
  const [from, setFrom, to, setTo] = useContext(Input)
  const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")

  if (typeof network === 'undefined') { // Migration from type to networks
    remove()
    showNotification({ id: 'deprecated-stops', title: 'Előzmények törölve!', color: 'grape', message: 'Az előzményeid törölve lettek, mert elavultak egy frissítés óta!', icon: <IconAlertCircle /> })
  }

  const set = (setter: any) => {
    setter({ value, network, id, sid })
  }

  return (<Menu trigger={touchscreen ? 'click' : 'hover'} shadow="md" radius="md" transition='rotate-right' position='bottom-start' closeOnClickOutside closeOnItemClick closeOnEscape>
    <Menu.Target>
      <Paper style={{ userSelect: 'none' }} sx={interactive} p='md' radius="lg" shadow="md">
        <Group position='apart'>
          <Group spacing='sm' noWrap>
            <StopIcon network={network} />
            <Text size='md'>{value}</Text>
          </Group>
        </Group>
      </Paper>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Label>{value}</Menu.Label>
      <Menu.Item onClick={() => set(setFrom)} icon={<IconArrowBarRight size={14} />}>Indulás innen</Menu.Item>
      <Menu.Item onClick={() => set(setTo)} icon={<IconArrowBarToRight size={14} />}>Érkezés ide</Menu.Item>
      <Menu.Item onClick={remove} color='red' icon={<IconX size={14} />}>Eltávolítás</Menu.Item>
    </Menu.Dropdown>
  </Menu>)
}

const Home: NextPage = () => {
  const router = useRouter()
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const [cookies, setCookie, removeCookie] = useCookies(['selected-networks']);
  const [from, setFrom] = useState<any>()
  const [to, setTo] = useState<any>()
  const [date, setDate] = useState<any>(false)
  const [time, setTime] = useState<any>(false)
  const theme = useMantineTheme()
  const width = useMediaQuery('(min-width: 560px)')
  const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")

  const search = () => {
    const params = (query: any) => {
      const ts: any = time ? { h: time.getHours().toString().padStart(2, '0'), m: time.getMinutes().toString().padStart(2, '0') } : {}
      let res: any = {}
      Object.entries({ ...ts, d: date ? dateString(date) : undefined, f: query.from.id, t: query.to.id, sf: query.from.sid, st: query.to.sid }).map((item: Array<any>) => {
        if (item[1]) {
          res[item[0]] = item[1]
        }
      })
      return (new URLSearchParams(res)).toString()
    }
    if (!cookies['selected-networks'].length) { setCookie("selected-networks", ['1', '2', '25', '3', '10,24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 }) }
    if (from && to) { router.push(`/routes?${params({ from, to })}`); return }
    const input: { from: string, to: string } = { from: (document.querySelector("#stopinput-from") as HTMLInputElement).value!, to: (document.querySelector("#stopinput-to") as HTMLInputElement).value! };
    let query: { from: any, to: any } = { from: {}, to: {} }
    if (!input.from || !input.to) { showNotification({ title: 'Hiba!', color: 'red', icon: <IconX />, message: 'Az indulási és az érkezési pont nem lehet üres!', id: 'inputerror-empty' }); return }
    apiCall("POST", "/api/autocomplete", { 'input': input.from, 'networks': cookies["selected-networks"] }).then(resp => {
      query["from"] = ((resp.results as Array<any>).map(item => ({ value: item.lsname, id: item.ls_id, sid: item.settlement_id, network: item.network_id })))[0]
      apiCall("POST", "/api/autocomplete", { 'input': input.to, 'networks': cookies["selected-networks"] }).then(resp => {
        query["to"] = ((resp.results as Array<any>).map(item => ({ value: item.lsname, id: item.ls_id, sid: item.settlement_id, network: item.network_id })))[0]
        if (typeof query.from !== 'undefined' && typeof query.to !== 'undefined') {
          setFrom(query.from)
          setTo(query.to)
          router.push(`/routes?${params(query)}`)
          return
        } else {
          showNotification({ icon: <IconX size={20} />, title: 'Hiba!', message: 'Nem található ilyen megálló!', color: 'red', id: 'inputerror-noresults' })
        }
      })
    })
  }

  useEffect(() => {
    window.addEventListener("search-trigger", search)
    return () => window.removeEventListener("search-trigger", search)
  }, [])

  return (<>
    <Stack spacing='md'>
      <StopInput selection={[from, setFrom]} variant='from' />
      <StopInput selection={[to, setTo]} variant='to' rightSection={<ActionIcon onClick={() => {
        const [f, t] = [from, to]
        setFrom(t)
        setTo(f)
      }} mr={6} radius="xl"><IconRefresh /></ActionIcon>} />
      <Grid sx={{ width: '100%' }}>
        <Grid.Col span="auto">
          <DatePicker clearable={false} sx={{ input: { border: '1px solid #7c838a' } }} radius='xl' onChange={setDate} value={date || new Date()} />
        </Grid.Col>
        <Grid.Col span="content">
          <TimeInput sx={{ '& .mantine-Input-input.mantine-TimeInput-input': { border: '1px solid #7c838a !important' } }} radius='xl' onChange={setTime} value={time || new Date()} />
        </Grid.Col>
        <Grid.Col span="content">
          <ActionIcon sx={{ border: '1px solid #7c838a' }} onClick={() => {
            setDate(false)
            setTime(false)
          }} variant='default' size="lg" radius="xl">
            <IconClock size={18} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Button onClick={search} leftIcon={<IconArrowForwardUp size={22} />} variant="gradient" gradient={{ from: theme.primaryColor, to: 'blue' }} radius="xl">Tovább</Button>
      <Divider size="md" />
      <Tabs sx={{ height: '100%', '& .mantine-Tabs-tabLabel': { fontSize: touchscreen ? theme.fontSizes.sm * 1.1 : theme.fontSizes.sm } }} variant="outline" radius="md" defaultValue="stops">
        <Tabs.List>
          <Tabs.Tab value="introduction" icon={<IconInfoCircle size={14} />}>Információ</Tabs.Tab>
          <Tabs.Tab value="stops" icon={<IconRotateClockwise2 size={14} />}>Gyors elérés</Tabs.Tab>
          <Tabs.Tab value="options" icon={<IconSettings size={14} />}>Preferenciák</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="introduction">
          <Stack spacing="sm" p="sm">
            <Stack spacing={2}>
              <Title sx={gradientText} size={25}>Modern menetrend kereső</Title>
              <Title order={2} size={15}>MÁV, Volánbusz, BKK, GYSEV, MAHART, BAHART</Title>
            </Stack>
            <List spacing={6}>
              <List.Item icon={<MyThemeIcon icon={IconLayout2} />}>Korszerű, letisztult és mobilbarát kezelőfelület.</List.Item>
              <List.Item icon={<MyThemeIcon icon={IconMoonStars} />}>Sötét és világos mód támogatás.</List.Item>
              <List.Item icon={<MyThemeIcon icon={IconSearch} />}>Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe.</List.Item>
              <List.Item icon={<MyThemeIcon icon={IconShare} />}>Útvonaltervek gyors megosztása.</List.Item>
              <List.Item icon={<MyThemeIcon icon={IconApps} />}>PWA (Progressive Web App) támogatás.</List.Item>
            </List>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="options" pt="xs">
          <Stack spacing='sm' style={{ margin: '0 auto', maxWidth: width ? '80%' : '100%' }}>
            <DiscountSelector />
            <NetworksSelector />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="stops" pt="xs">
          {!stops.length ? <Center>
            <Text size='sm' style={{ opacity: .8 }} align='center'>Itt fognak megjellenni a legutóbbi megállóid...</Text>
          </Center> :
            <Stack spacing='sm' px="sm" mb="xl">
              <Input.Provider value={[from, setFrom, to, setTo]}>
                {stops.map((item: any, i: any) => {
                  return (<Stop {...item} key={i} remove={() => setStops(stops.filter(fItem => !isEqual(fItem, item)))} />)
                })}
              </Input.Provider>
            </Stack>}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  </>)
}

export default Home