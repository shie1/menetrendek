import { Container, Group, Stack, Title } from '@mantine/core';
import type { NextPage } from 'next';
import { Logo } from '../components/brand';

const Home: NextPage = () => {
    return (<>
        <Stack spacing={0}>
            <Group spacing={0} align="center" position='center'>
                <Logo size={65} />
                <Title ml="sm" size={50}>Menetrendek</Title>
            </Group>
            <Title align='center' weight={600} color={"dimmed"} order={2}>A modern menetrend kereső</Title>
        </Stack>
    </>)
}

export default Home