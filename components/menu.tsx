import { Grid, Button, useMantineTheme } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { IconSearch } from "@tabler/icons"
import { Stop, StopInput } from "./stops"
import { useCallback, useContext, useEffect, useState } from "react"
import { apiCall } from "./api"
import { dateString } from "../client"
import { Input } from "../pages/_app"
import Link from "next/link"
import { useRouter } from "next/router"

export const Search = () => {
    const theme = useMantineTheme()
    const [searchHref, setSearchHref] = useState<string>("#")
    const { selection, setSelection, input } = useContext(Input)
    const [from, setFrom]: any = [selection ? selection.from as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, from: e }) }]
    const [to, setTo]: any = [selection ? selection.to as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, to: e }) }]
    const [from_input, to_input] = [input.from, input.to]
    const [date, setDate] = useState<Date | null>(null)
    const router = useRouter()

    const generateUrl = useCallback(async () => {
        if (!from || !to) { setSearchHref("#"); return }
        const f_id: any = parseInt(`${from.id}${from.network === 0 ? '0' : '1'}`)
        const t_id: any = parseInt(`${to.id}${to.network === 0 ? '0' : '1'}`)
        setSearchHref(`/routes?${(new URLSearchParams({
            ...(from ? { from: f_id } : {}),
            ...(to ? { to: t_id } : {}),
            ...(date ? dateString(date) === dateString(new Date()) ? {} : { d: dateString(date) } : {})
        })).toString()}`)
    }, [from, to, from_input, to_input, date])

    useEffect(() => {
        generateUrl()
    }, [from, to, from_input, to_input, date])

    useEffect(() => {
        if (searchHref) router.prefetch(searchHref)
    }, [searchHref])

    return (<Grid>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='from' />
        </Grid.Col>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='to' />
        </Grid.Col>
        <Grid.Col xs={6} span={12}>
            <DatePicker clearable={false} dropdownPosition="bottom-start" locale='hu' value={new Date()} variant='unstyled' styles={(theme) => ({ dropdown: { background: "#1A1B1E", borderRadius: theme.radius.md, border: '1px solid', borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2] }, input: { fontSize: 16, border: 'unset', background: 'transparent' }, wrapper: { width: '100%', height: 36 }, root: { borderBottom: '2px solid #373A40', height: 45, display: 'flex', alignItems: 'center', } })} />
        </Grid.Col>
        <Grid.Col sx={{ display: 'flex', alignItems: 'center' }} xs={6} span={12}>
            <Link href={searchHref}>
                <Button gradient={{ from: theme.primaryColor, to: theme.colors.blue[theme.primaryShade as number] }} variant="gradient" sx={{ width: '100%' }} leftIcon={<IconSearch />}>Keresés</Button>
            </Link>
        </Grid.Col>
    </Grid>)
}