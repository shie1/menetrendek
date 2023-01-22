import type { NextPage } from "next/types";
import { apiCall } from "../components/api";
import { Alert, Grid, Group, Title } from "@mantine/core";
import { PageHeading } from "../components/page";
import { IconBuilding, IconPrompt } from "@tabler/icons";
import { CityCard } from "../components/cityCard";

const Cities: NextPage = (props: any) => {
    return (<>
        <PageHeading icon={IconBuilding} title="Városok" subtitle="Itt találod a legnépszerűbb városokat" />
        <Alert my="sm" icon={<IconPrompt />} title="Fejlesztés alatt">
            A város oldalak jelenleg csak demonstrációs jellegűek, a városokhoz még nem tartozik semmi adat.
        </Alert>
        <Grid mt="sm">
            {props.topCities.map((city: any) => {
                return (<Grid.Col span={12} xs={6} sm={4} key={city.id}>
                    <CityCard id={city.id} image={city.image} title={city.name} county={{ name: city.county, id: city.county_id }} description={`${city.stops} megálló`} />
                </Grid.Col>)
            })}
        </Grid>
    </>)
}

Cities.getInitialProps = async () => {
    return {
        topCities: await apiCall("GET", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/cities/top`)
    }
}

export default Cities