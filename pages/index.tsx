import { Container, Group, Stack, Title } from '@mantine/core';
import type { NextPage } from 'next';
import { Logo } from '../components/brand';
import { PageHeading } from '../components/page';
import { IconRoadSign } from '@tabler/icons';

const Home: NextPage = () => {
    return (<>
        <PageHeading icon={IconRoadSign} title="Menetrendek" subtitle='A modern menetrend kereső'/>
    </>)
}

export default Home