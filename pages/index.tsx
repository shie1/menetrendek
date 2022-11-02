import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Menu,
  Paper,
  Stack,
  Tabs,
  Text,
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
} from '@tabler/icons';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { StopIcon, StopInput } from '../components/stops'
import { dateString } from '../client';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { isEqual } from "lodash"
import { interactive } from '../components/styles';
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
  const [date, setDate] = useState<any>(new Date())
  const [time, setTime] = useState<any>(false)
  const theme = useMantineTheme()
  const width = useMediaQuery('(min-width: 560px)')

  const search = () => {
    if (!cookies['selected-networks'].length) { setCookie("selected-networks", ['1', '2', '25', '3', '10,24', '13', '12', '11', '14'], { path: '/', maxAge: 60 * 60 * 24 * 365 }) }
    const ts = time ? `&h=${time.getHours().toString().padStart(2, '0')}&m=${time.getMinutes().toString().padStart(2, '0')}` : ''
    if (from && to) { router.push(`/routes?f=${from.id}&t=${to.id}&sf=${from.sid}&st=${to.sid}${ts}&d=${dateString(date)}`); return }
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
          router.push(`/routes?f=${query.from.id}&t=${query.to.id}&sf=${query.from.sid}&st=${query.to.sid}${ts}&d=${dateString(date)}`)
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
      <StopInput selection={[to, setTo]} variant='to' />
      <Grid sx={{ width: '100%' }}>
        <Grid.Col span="auto">
          <DatePicker clearable={false} sx={{ input: { border: '1px solid #7c838a' } }} radius='xl' onChange={setDate} value={date} />
        </Grid.Col>
        <Grid.Col span="content">
          <TimeInput sx={{ '& .mantine-Input-input.mantine-TimeInput-input': { border: '1px solid #7c838a !important' } }} radius='xl' onChange={setTime} value={time ? time : new Date()} />
        </Grid.Col>
        <Grid.Col span="content">
          <ActionIcon sx={{ border: '1px solid #7c838a' }} onClick={() => {
            setDate(new Date())
            setTime(false)
          }} variant='default' size="lg" radius="xl">
            <IconClock size={18} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Button onClick={search} leftIcon={<IconArrowForwardUp size={22} />} variant="gradient" gradient={{ from: theme.primaryColor, to: 'blue' }} radius="xl">Tovább</Button>
      <Divider size="md" />
      <Tabs sx={{ height: '100%' }} variant="outline" radius="md" defaultValue="stops">
        <Tabs.List>
          <Tabs.Tab value="stops" icon={<IconRotateClockwise2 size={14} />}>Megállók</Tabs.Tab>
          <Tabs.Tab value="options" icon={<IconSettings size={14} />}>Preferenciák</Tabs.Tab>
        </Tabs.List>
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