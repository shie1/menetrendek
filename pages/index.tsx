import {
  ActionIcon,
  Button,
  Center,
  createStyles,
  Divider,
  Grid,
  Group,
  Menu,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications';
import { IconArrowForwardUp, IconClock, IconX, IconSettings, IconRotateClockwise2, IconBus, IconCircle, IconArrowBarToRight, IconArrowBarRight, IconMenu2 } from '@tabler/icons';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';
import StopInput from '../components/stop_input'
import { dateString } from '../client';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { isEqual } from "lodash"
import { interactive } from '../components/styles';

const Input = createContext<any>([])

const Stop = ({ value, type, id, sid, remove }: { value: string, type: "megallo" | "telepules", id: number, sid: number, remove: any }) => {
  const [from, setFrom, to, setTo] = useContext(Input)
  const touchscreen = useMediaQuery("(hover: none) and (pointer: coarse)")

  const set = (setter: any) => {
    setter({ value, type, id, sid })
  }

  return (<Menu trigger={touchscreen ? 'click' : 'hover'} shadow="md" radius="md" transition='rotate-right' position='bottom-start' closeOnClickOutside closeOnItemClick closeOnEscape>
    <Menu.Target>
      <Paper style={{ userSelect: 'none' }} sx={interactive} p='md' radius="lg" shadow="md">
        <Group position='apart'>
          <Group spacing='sm' noWrap>
            {type === "megallo" ? <IconBus size={28} /> : <IconCircle size={28} />}
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

const useRoundInputStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: 'auto',
    paddingTop: 18,
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

const DiscountSelector = () => {
  const [discount, setDiscount] = useLocalStorage<number>({ key: 'discount-percentage', defaultValue: 0 })
  const { classes } = useRoundInputStyles()

  return (<Select
    data={[{ value: '0', label: 'Nincs' }, { value: '50', label: '50%' }, { value: '90', label: '90%' }, { value: '100', label: 'Díjmentes' }]}
    value={discount.toString()}
    onChange={(e) => setDiscount(Number(e))}
    label="Kedvezmény típusa"
    radius='lg'
    classNames={classes}
  />)
}

const TransferLimiter = () => {
  const min = 0
  const max = 5

  const { classes } = useRoundInputStyles()
  const [value, setValue] = useLocalStorage<number | undefined>({ key: 'maximum-transfers', defaultValue: 5 });

  return (<NumberInput label="Max átszállások" radius='lg' {...{ min, max }} value={value} onChange={setValue} classNames={classes} />);
}

const Home: NextPage = () => {
  const router = useRouter()
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const [from, setFrom] = useState<any>()
  const [to, setTo] = useState<any>()
  const [date, setDate] = useState<any>(new Date())
  const [time, setTime] = useState<any>(false)

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
      <Button onClick={() => {
        if (!from || !to) { showNotification({ icon: <IconX size={20} />, title: 'Hiba!', message: 'Az indulási és az érkezési pont nincs kiválasztva!', color: 'red', id: 'inputError1' }); return }
        const ts = time ? `&h=${time.getHours().toString().padStart(2, '0')}&m=${time.getMinutes().toString().padStart(2, '0')}` : ''
        router.push(`/routes?f=${from.id}&t=${to.id}&sf=${from.sid}&st=${to.sid}${ts}&d=${dateString(date)}`)
      }} leftIcon={<IconArrowForwardUp size={22} />} radius="xl">Tovább</Button>
      <Divider size="md" />
      <Tabs sx={{ height: '100%' }} variant="outline" radius="md" defaultValue="stops">
        <Tabs.List>
          <Tabs.Tab value="stops" icon={<IconRotateClockwise2 size={14} />}>Megállók</Tabs.Tab>
          <Tabs.Tab value="options" icon={<IconSettings size={14} />}>Preferenciák</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="options" pt="xs">
          <Stack spacing='sm' style={{ margin: '0 auto', maxWidth: '50%' }}>
            <DiscountSelector />
            <TransferLimiter />
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