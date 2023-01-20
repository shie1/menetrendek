import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { dateString } from "../client"
import { PageHeading } from "../components/page"
import { IconLine } from "@tabler/icons"

const Routes: NextPage = (props: any) => {
    return (<>
        <PageHeading title="Járatok" subtitle={`Járatok ${props.routes.nativeResults.Params["FromSettle:"]} és ${props.routes.nativeResults.Params["ToSettle:"]} között`} icon={IconLine} />

    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/routes`, { from: ctx.query.from, to: ctx.query.to, date: ctx.query.date || dateString(new Date()) })
    }
}

export default Routes