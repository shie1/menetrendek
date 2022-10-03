import { ActionIcon, Button, createStyles, Divider, Grid, Group, Paper, Stack, Text } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications';
import { IconArrowForwardUp, IconCircle, IconClock, IconX, IconBus, IconArrowBarRight, IconArrowBarToRight } from '@tabler/icons';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StopInput from '../components/stop_input'
import { dateString } from '../client';
import Head from 'next/head';
import { useLocalStorage } from '@mantine/hooks';
import { interactive } from '../components/styles';

const stopsMaxLength = 5

const Home: NextPage = () => {
  const router = useRouter()
  const [stops, setStops] = useLocalStorage<Array<any>>({ key: 'frequent-stops', defaultValue: [] })
  const [from, setFrom] = useState<any>()
  const [to, setTo] = useState<any>()
  const [date, setDate] = useState<any>(new Date())
  const [time, setTime] = useState<any>(new Date())

  return (<>
    <Stack spacing='md'>
      <StopInput onChange={setFrom} variant='from' />
      <StopInput onChange={setTo} variant='to' />
      <Grid sx={{ width: '100%' }}>
        <Grid.Col span="auto">
          <DatePicker clearable={false} sx={{ input: { border: '1px solid #7c838a' } }} radius='xl' onChange={setDate} value={date} />
        </Grid.Col>
        <Grid.Col span="content">
          <TimeInput sx={{ '& .mantine-Input-input.mantine-TimeInput-input': { border: '1px solid #7c838a !important' } }} radius='xl' onChange={setTime} value={time} />
        </Grid.Col>
        <Grid.Col span="content">
          <ActionIcon sx={{ border: '1px solid #7c838a' }} onClick={() => {
            setDate(new Date())
            setTime(new Date())
          }} variant='default' size="lg" radius="xl">
            <IconClock size={18} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Button onClick={() => {
        if (!from || !to) { showNotification({ icon: <IconX size={20} />, title: 'Hiba!', message: 'Az indulási és az érkezési pont nincs kiválasztva!', color: 'red', id: 'inputError1' }); return }
        router.push(`/routes?f=${from.id}&t=${to.id}&sf=${from.sid}&st=${to.sid}&h=${time.getHours().toString().padStart(2, '0')}&m=${time.getMinutes().toString().padStart(2, '0')}&d=${dateString(date)}`)
      }} leftIcon={<IconArrowForwardUp size={22} />} radius="xl">Tovább</Button>
      <Divider size="md" />
    </Stack>
  </>)
}

export default Home