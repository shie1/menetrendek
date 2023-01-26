// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from "../../components/mysql"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { input } = req.body
    let cities: Array<any> = []
    let inp = `^${input.replace(/\s$/g, '').replace(/,\s/g, ' ')}`
    const results = await query('SELECT c.name as city, s.id as id, CONCAT(c.name, ", ", s.name) as stop_name, network FROM menetrendek_info.stops as s LEFT JOIN cities as c ON s.city=c.id WHERE CONCAT(c.name, " ", s.name) REGEXP ? LIMIT 50;', [inp])
    await Promise.all(results.map(async (stop, index) => {
        const city: any = (await query("SELECT id,name FROM cities WHERE name = ?;", [stop.city])).map((city) => ({ stop_name: city.name, id: city.id, network: 0, city: city.name }))[0]
        if (!cities.includes(stop.city)) {
            results.splice(index, 0, city)
            cities.push(stop.city)
        }
    }))
    res.status(200).json(results.sort((a, b) => {
        if (a.city === b.city) return a.network - b.network
        return 0
    }))
}
