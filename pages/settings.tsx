import type { NextPage } from "next"
import { PageHeading } from "../components/page"
import { IconDiscount, IconSettings } from "@tabler/icons"
import { ContentCard } from "../components/settingsCard"
import { NumberInput, Stack, Text } from "@mantine/core"
import useColors from "../components/colors"
import { useCookies } from "react-cookie"

const Settings: NextPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage'])
    const { warning } = useColors()

    return (<>
        <PageHeading title="Beállítások" subtitle="Alapvető preferenciák az alkalmazás személyre szabására" icon={IconSettings} />
        <Stack mt="sm" spacing="sm">
            <div id="discount"><ContentCard title="Kedvezmény" icon={IconDiscount}>
                <Text>Kedvezménnyel utazol? Állítsd be, hogy hány százalék és mi előre kiszámítjuk neked a jegy árát!</Text>
                <Text color={warning} size="xs">A kedvezményes árak, csak tájékoztató jellegűek!</Text>
                <NumberInput
                    value={Number(cookies['discount-percentage']) || 0}
                    onChange={(e) => setCookie("discount-percentage", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                    min={0} max={100} size="md"
                />
            </ContentCard></div>
        </Stack>
    </>)
}

export default Settings