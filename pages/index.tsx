import { Divider, Group, Menu, Paper, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX, IconArrowBarToRight, IconArrowBarRight, IconAlertCircle } from '@tabler/icons';
import type { NextPage } from 'next'
import { StopIcon } from '../components/stops';
import { useMediaQuery } from '@mantine/hooks';
import { interactive } from '../components/styles';
import { QuickMenu, SearchSection } from '../components/menu';

const Stop = ({ value, network, id, sid, remove }: { value: string, network: Number, id: number, sid: number, remove: any }) => {
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
      <Menu.Item icon={<IconArrowBarRight size={14} />}>Indulás innen</Menu.Item>
      <Menu.Item icon={<IconArrowBarToRight size={14} />}>Érkezés ide</Menu.Item>
      <Menu.Item onClick={remove} color='red' icon={<IconX size={14} />}>Eltávolítás</Menu.Item>
    </Menu.Dropdown>
  </Menu>)
}

const Home: NextPage = () => {

  return (<>
    <QuickMenu />
  </>)
}

export default Home