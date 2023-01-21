import type { NextPage } from "next"
import { PageHeading } from "../components/page"
import { IconSettings } from "@tabler/icons"

const Settings: NextPage = () => {
    return (<>
        <PageHeading title="Beállítások" subtitle="Alapvető preferenciák az alkalmazás személyre szabására" icon={IconSettings}/>
    </>)
}

export default Settings