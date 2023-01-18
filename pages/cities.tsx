import type { NextPage } from "next/types";
import { apiCall } from "../components/api";
import { Grid, Group, Title } from "@mantine/core";
import { PageHeading } from "../components/page";
import { IconBuilding } from "@tabler/icons";
import { CityCard } from "../components/cityCard";

const Cities: NextPage = (props: any) => {
    return (<>
        <PageHeading icon={IconBuilding} title="Városok" subtitle="Itt találod a legnépszerűbb városokat" />
        <Grid mt="sm">
            {props.topCities?.map((city: any) => {
                return (<Grid.Col span={12} xs={6} sm={4} key={city.id}>
                    <CityCard image={city.image} title={city.name} county={city.county} description={`${city.stops} megálló`} />
                </Grid.Col>)
            })}
        </Grid>
    </>)
}

Cities.getInitialProps = async () => {
    return {
        topCities: await apiCall("GET", "http://localhost:3000/api/cities/top")
    }
}

export default Cities