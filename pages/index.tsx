import { Box, Divider, Grid, Group, Space, Stack, Text } from '@mantine/core';
import type { NextPage } from 'next';
import { PageHeading, PageSection } from '../components/page';
import { IconApps, IconLayout, IconPlus, IconRoadSign, IconRotateClockwise, IconSearch, IconShare, IconUsers } from '@tabler/icons';
import "dayjs/locale/hu"
import { Search } from '../components/menu';
import { FeaturesGrid } from '../components/hello';

const Home: NextPage = () => {
    return (<>
        <PageHeading icon={IconRoadSign} title="Menetrendek" subtitle='A modern menetrend kereső' />
        <Stack px="xs" spacing={0} sx={{ position: 'relative', display: 'flex' }}>
            <Box sx={(theme) => ({ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 20px)', margin: '5px 0', borderRadius: theme.radius.md, background: theme.fn.rgba(theme.colors.dark[9], .7) })} />
            <Divider size="sm" my="sm" mt="md" label={<Text size="md">Útvonalterv készítése</Text>} />
            <Search />
            <Space h="xl" />
            <Space h="xs" />
        </Stack>
        <PageSection icon={IconPlus} title="Miért válassz minket?" subtitle="Íme néhány dolog, amiben egyszerűen jobbak vagyunk" />
        <Space h="md" />
        <FeaturesGrid
            data={[
                { title: "Kezelőfelület", icon: IconLayout, description: "Modern, letisztult és mobilbarát kezelőfelület." },
                { title: "Gyors elérés", icon: IconSearch, description: "Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe." },
                { title: "Megosztás", icon: IconShare, description: "Útvonaltervek gyors megosztása kép formájában." },
                { title: "PWA támogatás", icon: IconApps, description: "Ez a weboldal egy PWA (progresszív webalkalmazás), így könnyen letöltheted alkalmazásként a telefonodra." },
                { title: "Aktív fejlesztés", icon: IconRotateClockwise, description: "A weboldal szinte minden héten frissül. A funkciók folyamatosan bővülnek és a hibák folyamatosan javítva vannak." },
            ]}
        />
        <Space h="md" />
    </>)
}

export default Home