import { Stack, TextInput } from '@mantine/core'
import { IconArrowBarRight, IconArrowBarToRight } from '@tabler/icons'
import type { NextPage } from 'next'
import StopInput from '../components/stop_input'

const Home: NextPage = () => {
  return (<>
    <Stack spacing='sm'>
      <StopInput variant='from' />
      <StopInput variant='to' />
    </Stack>
  </>)
}

export default Home