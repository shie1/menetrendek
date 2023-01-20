import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { dateString } from "../client"

const Routes: NextPage = (props: any) => {
    console.log(props)
    return (<></>)
}

Routes.getInitialProps = async (ctx: any) => {
    console.log(ctx)
    return {
        routes: await apiCall("POST", `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/api/routes`, { from: ctx.query.from, to: ctx.query.to, date: ctx.query.date || dateString(new Date()) })
    }
}

export default Routes