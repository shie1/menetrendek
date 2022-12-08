import { Title, Container, Stack, Group, Text, Divider } from "@mantine/core";
import { IconLayout } from "@tabler/icons";
import type { NextPage } from "next";
import { FeaturesGrid } from "../components/hello";

const Home: NextPage = () => {
    return (<Container>
        <Stack pb="xl" spacing={3}>
            <Title>Menetrendek</Title>
            <Title mt={-8} style={{ fontSize: '1.4rem' }} color="dimmed" order={2}>A modern menetrend kereső</Title>
            <Title mt={-2} color="dimmed" style={{ fontSize: '1.1rem' }} order={3} >MÁV, Volánbusz, BKK, GYSEV, MAHART, BAHART</Title>
            <Text  style={{fontSize: '1rem'}} color="dimmed" weight={600}>Íme néhány dolog, amiben egyszerűen jobbak vagyunk:</Text>
        </Stack>
        <FeaturesGrid
            data={[
                { title: "Kezelőfelület", icon: IconLayout, description: "Modern, letisztult és mobilbarát kezelőfelület." }
            ]}
        />
    </Container>)
}

export default Home