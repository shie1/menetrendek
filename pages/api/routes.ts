// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routes } from '../../client'
import { Stop } from '../../components/stops'
import { query } from '../../components/mysql'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = req.body
    const [from, to] = await Promise.all([rb.from, rb.to].map(async (stop: number) => {
        const network = parseInt(stop.toString().at(-1) as string)
        const id = stop.toString().slice(0, -1)
        if (network == 0) {
            const q = await query("SELECT cdata_id FROM cities WHERE id = ?;", [id])
            return { s_id: q[0].cdata_id }
        } else {
            const q = await query("SELECT c.cdata_id as city_id, s.cdata_id as stop_id, s.cdata_site_code as site_code FROM stops as s LEFT JOIN cities as c ON s.city=c.id WHERE s.id = ?;", [id])
            return { s_id: q[0].city_id, ls_id: q[0].stop_id, site_code: q[0].site_code }
        }
    }))
    res.status(200).json(await routes({ date: rb.date, from, to }, "hu"))
}