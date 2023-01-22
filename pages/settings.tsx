import type { NextPage } from "next"
import { PageHeading } from "../components/page"
import { IconCalendar, IconDiscount, IconSettings } from "@tabler/icons"
import { ContentCard } from "../components/settingsCard"
import { NumberInput, SegmentedControl, Stack, Text } from "@mantine/core"
import useColors from "../components/colors"
import { useCookies } from "react-cookie"
import { useUserAgent } from "../components/ua"
import { useMediaQuery } from "@mantine/hooks"

const Settings: NextPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'calendar-service'])
    const ua = useUserAgent()
    const { warning } = useColors()

    const segmentedBreak = useMediaQuery('(max-width: 640px)');

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
            <div id="calendar"><ContentCard icon={IconCalendar} title="Naptár alkalmazás">
                <Stack spacing={4}>
                    <Text size="md">Itt beállíthatod, hogy melyik naptár appot használod.</Text>
                    <Text mt={-4} size="sm">Készülékedhez javasolt: {ua?.device.vendor === "Apple" ? `Egyéb (ICS)` : "Bármely"}</Text>
                    <Stack justify="center">
                        <SegmentedControl size={segmentedBreak ? "md" : "sm"} fullWidth orientation={segmentedBreak ? "vertical" : "horizontal"} value={cookies["calendar-service"] || '1'} onChange={(e) => setCookie("calendar-service", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })} data={[{ label: "Google Calendar", value: '1' }, { label: "Outlook", value: '2' }, { label: "Office 365", value: '3' }, { label: "Yahoo", value: '4' }, { label: `Egyéb (ICS)`, value: '5' }]} />
                    </Stack>
                </Stack>
            </ContentCard></div>
        </Stack>
    </>)
}

export default Settings