import type { NextPage } from "next"
import PageTransition from "../components/pageTransition"
import { Stack, Text, Image, SegmentedControl, Center, NumberInput } from "@mantine/core"
import { CheckboxCard, ContentCard } from "../components/checkCard"
import { useCookies } from "react-cookie"
import { IconArrowAutofitDown, IconDiscount, IconWalk } from "@tabler/icons"
import { RouteExposition } from "../components/routes"
import { transferExample } from "../components/mockdata"

const Settings: NextPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['no-page-transitions', 'discount-percentage', 'action-timeline-type', 'route-limit', 'use-route-limit'])
    const img = (theme: any) => ({ '& img': { boxShadow: theme.shadows.lg, borderRadius: theme.radius.lg, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, })

    return (<PageTransition>
        <Stack>
            <ContentCard icon={IconDiscount} title="Kedvezmény">
                <Stack spacing={4}>
                    <Text size="md">Itt be tudod állítani, hogy hány százalékos kedvezménnyel utazol.</Text>
                    <NumberInput
                        value={Number(cookies['discount-percentage']) || 0}
                        onChange={(e) => setCookie("discount-percentage", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={0} max={100} size="md"
                    />
                </Stack>
            </ContentCard>
            <CheckboxCard title="Útvonalterv limit" checked={cookies["use-route-limit"] === "true"} onChange={(e) => { setCookie("use-route-limit", e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }}>
                <Stack spacing={4}>
                    <Text size="md">Az egyszerre megjelenített útvonaltervek korlátozva vannak és egy időcsúszkával tudsz böngészni.</Text>
                    <Text mt={-4}>Az oldal annál gyorsabb, minél kevesebb jelenik meg egyszerre.</Text>
                    <Text mt={-4} size="xs" color="yellow">A funkció kikapcsolása nem ajánlott!</Text>
                    <NumberInput
                        value={Number(cookies['route-limit']) || 0}
                        placeholder="10"
                        onChange={(e) => setCookie("route-limit", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={10} max={100} size="md"
                    />
                    <Image sx={img} alt="Útvonalterv limit" src="/api/img/route-limit.png" />
                </Stack>
            </CheckboxCard>
            <ContentCard icon={IconWalk} title="Idővonal megjelenése">
                <Stack spacing={4}>
                    <Text size="md">2 féle módon tudjuk neked ábrázolni az átszállásokat, válaszd ki azt amelyik számodra logikusabb.</Text>
                    <Stack justify="center">
                        <SegmentedControl data={[{ label: "A", value: '1' }, { label: "B", value: '2' }]} value={cookies["action-timeline-type"] ? cookies["action-timeline-type"] : "1"} onChange={(e) => setCookie("action-timeline-type", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })} />
                        <Center p="sm">
                            <RouteExposition details={transferExample} query={{ user: { discount: 0, actionTimelineType: Number(cookies["action-timeline-type"]) } }} withInfoButton={false} />
                        </Center>
                    </Stack>
                </Stack>
            </ContentCard>
            <CheckboxCard checked={cookies["no-page-transitions"] === "false"} onChange={(e) => { setCookie("no-page-transitions", !e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }} title="Tartalomátmenetek">
                <Stack spacing={4}>
                    <Text size="md">Ha zavarnak a tartalomátmenetek, itt kikapcsolhatod.</Text>
                    <Image sx={img} alt="Tartalomátmenetek ki- és bekapcsolt állapotban" src="https://i.imgur.com/tJv1MPE.gif" />
                </Stack>
            </CheckboxCard>
        </Stack>
    </PageTransition >)
}

export default Settings