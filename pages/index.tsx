import { Divider, Text, Grid, Button } from '@mantine/core';
import type { NextPage } from 'next';
import { PageHeading } from '../components/page';
import { IconRoadSign, IconSearch } from '@tabler/icons';
import { StopInput } from '../components/stops';
import { DatePicker } from '@mantine/dates';

const Home: NextPage = () => {
    return (<>
        <PageHeading icon={IconRoadSign} title="Menetrendek" subtitle='A modern menetrend kereső' />
        <div id='search-routes'>
            <Divider size="lg" my="sm" mt="md" label={<Text size="md">Útvonalterv készítése</Text>} />
            <div>
                <Grid>
                    <Grid.Col sm={6} span={12}>
                        <StopInput variant='from' />
                    </Grid.Col>
                    <Grid.Col sm={6} span={12}>
                        <StopInput variant='to' />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <DatePicker />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Button sx={{ width: '100%' }} leftIcon={<IconSearch />}>Keresés</Button>
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    </>)
}

export default Home