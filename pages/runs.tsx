import { Group, LoadingOverlay, Stack, Table, Text, useMantineTheme } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiCall } from "../components/api";

const Runs: NextPage = () => {
    const [query, setQuery] = useState<any>()
    const [runs, setRuns] = useState<any>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const theme = useMantineTheme()

    useEffect(() => {
        setLoading(true)
        if (router.query['id']) {
            setQuery({
                id: Number(router.query['id'] as string),
                sls: Number(router.query['s'] as string),
                els: Number(router.query['e'] as string),
                date: router.query['d'] as string
            })
        }
    }, [router])

    useEffect(() => {
        if (query) {
            apiCall("POST", "/api/runs", query).then((e) => { setRuns(e); setLoading(false) })
        }
    }, [query])

    return (<>
        <LoadingOverlay visible={loading} />
        <Stack my="md" spacing='sm'>
            <Stack mb='sm' spacing={0} justify="center" align="center">
                <Text size={30} mb={-10}>{runs?.results.mezo}/{runs?.results.jaratszam}</Text>
                <Text size="xl">{runs?.results.kozlekedteti}</Text>
                <Text size="sm">{runs?.results.kozlekedik}</Text>
            </Stack>
            <Table verticalSpacing="sm" horizontalSpacing='sm' withColumnBorders>
                <thead style={{ textAlign: 'center', borderBottom: `1px solid ${theme.colorScheme === "dark" ? "#373A40" : "#dee2e6"}` }}>
                    <tr>
                        <td colSpan={2}></td>
                        <td colSpan={2}>Mentetrendi</td>
                        <td colSpan={2}>Valós</td>
                    </tr>
                    <tr>
                        <td>#</td>
                        <td>Megálló</td>
                        <td>érk.</td>
                        <td>ind.</td>
                        <td>érk.</td>
                        <td>ind.</td>
                    </tr>
                </thead>
                <tbody>
                    {!runs ? <></> :
                        Object.keys(runs.results.kifejtes_sor).map((i: any) => {
                            const item = runs.results.kifejtes_sor[i]
                            return (<tr key={i}>
                                <td>{i.padStart(2, '0')}</td>
                                <td>{item.departureCity}, {item.departureStation}</td>
                                <td>{item.erkezik}</td>
                                <td>{item.indul}</td>
                                <td>{item.varhato_erkezik}</td>
                                <td>{item.varhato_indul}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </Table>
        </Stack>
    </>)
}

export default Runs