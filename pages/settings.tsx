import type { NextPage } from "next"
import PageTransition from "../components/pageTransition"
import { Stack, Text, Group } from "@mantine/core"
import { CheckboxCard } from "../components/checkCard"
import { useCookies } from "react-cookie"
import { useEffect } from "react"


const Settings: NextPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['nerf-mode'])

    return (<PageTransition>
        <Stack>
            <CheckboxCard checked={cookies["nerf-mode"] === "true"} onChange={(e) => { setCookie("nerf-mode", e, { path: '/', maxAge: 60 * 60 * 24 * 365 }) }} title="Nerf mode" description={<Group spacing={4}><Text size={16}>Ha villog a weboldal, vagy valami nem működik, ezt kell bekapcsolni.</Text><Text>A különböző webböngészők különböző módokon oldanak meg külünböző funkciókat, ennek hatására a weboldal nem minden böngészőben és készüléken fog az elvárt módon működni. Ez a beállítás igyekszik kiküszöbölni ezt, bizonyos funkciók &quot;gyengítésével&quot;.</Text><Text color="blue">Ez a funkció Apple készülékeken javasolt.</Text></Group>} />
        </Stack>
    </PageTransition >)
}

export default Settings