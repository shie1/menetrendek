import { Divider, Text, Grid, Button } from '@mantine/core';
import type { NextPage } from 'next';
import { PageHeading } from '../components/page';
import { IconRoadSign, IconSearch } from '@tabler/icons';
import { StopInput } from '../components/stops';
import { DatePicker } from '@mantine/dates';
import "dayjs/locale/hu"
import { Search } from '../components/menu';

const Home: NextPage = () => {
    return (<>
        <PageHeading icon={IconRoadSign} title="Menetrendek" subtitle='A modern menetrend kereső' />
        <div id='search-routes'>
            <Divider size="lg" my="sm" mt="md" label={<Text size="md">Útvonalterv készítése</Text>} />
            <Search />
        </div>
    </>)
}

export default Home