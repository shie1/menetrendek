import { Button, createStyles, Group, Stack } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications';
import { IconArrowForwardUp, IconX } from '@tabler/icons';
import type { NextPage } from 'next'
import { useState } from 'react';
import StopInput from '../components/stop_input'

const Home: NextPage = () => {
  const [from, setFrom] = useState<any>()
  const [to, setTo] = useState<any>()
  const [date, setDate] = useState<any>(new Date())
  const [time, setTime] = useState<any>(new Date())

  return (<>
    <Stack spacing='md'>
      <StopInput onChange={setFrom} variant='from' />
      <StopInput onChange={setTo} variant='to' />
      <Group grow>
        <DatePicker radius='xl' onChange={setDate} value={date} />
        <TimeInput radius='xl' onChange={setTime} value={time} />
      </Group>
      <Button onClick={() => {
        if (!from || !to) { showNotification({ icon: <IconX size={20} />, title: 'Hiba!', message: 'Az indulási és az érkezési pont nincs kiválasztva!', color: 'red', id: 'inputError1' }) }
      }} leftIcon={<IconArrowForwardUp size={22} />} radius="xl">Tovább</Button>
    </Stack>
  </>)
}

export default Home