import type { NextPage } from "next"
import PageTransition from "../components/pageTransition"
import { Stack, Text, Image, Card, Title, NumberInput } from "@mantine/core"
import { CheckboxCard, ContentCard } from "../components/checkCard"
import { useCookies } from "react-cookie"
import { useEffect } from "react"
import { IconDiscount } from "@tabler/icons"


const Settings: NextPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['no-page-transitions', 'discount-percentage'])

    return (<PageTransition>
        <Stack>
            <ContentCard icon={IconDiscount} title="Kedvezmény">
                <Stack spacing={4}>
                    <Text>Itt be tudod állítani, hogy hány százalékos kedvezménnyel utazol.</Text>
                    <NumberInput
                        value={Number(cookies['discount-percentage']) || 0}
                        onChange={(e) => setCookie("discount-percentage", e, { path: '/', maxAge: 60 * 60 * 24 * 365 })}
                        min={0} max={100} size="md"
                    />
                </Stack>
            </ContentCard>
            <CheckboxCard checked={cookies["no-page-transitions"] === "false"} onChange={(e) => { setCookie("no-page-transitions", !e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }} title="Tartalomátmenetek" description={<Stack spacing={4}><Text>Ha zavarnak a tartalomátmenetek, itt kikapcsolhatod.</Text><Image sx={(theme) => ({ '& img': { boxShadow: theme.shadows.lg, borderRadius: theme.radius.lg, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, })} alt="Tartalomátmenetek ki- és bekapcsolt állapotban" src="https://i.imgur.com/tJv1MPE.gif" /></Stack>} />
        </Stack>
    </PageTransition >)
}

export default Settings