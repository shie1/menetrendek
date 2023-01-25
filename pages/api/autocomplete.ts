// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from "../../components/mysql"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { input } = req.body
    let cities: Array<any> = []
    let inp = input.replace(/\s$/g, '').replace(/,\s/g, ' ')
    const results = await query('SELECT c.name as city, s.id as id, CONCAT(c.name, ", ", s.name) as stop_name, network FROM menetrendek_info.stops as s LEFT JOIN cities as c ON s.city=c.id WHERE CONCAT(c.name, " ", s.name) REGEXP ? LIMIT 50;', [inp])
    for (let result of results) {
        if (!cities.includes(result.city)) {
            cities.push(result.city)
        }
    }
    cities = await Promise.all(cities.map(async (city) => {
        return (await query("SELECT id,name FROM cities WHERE name = ?;", [city])).map((city) => ({ stop_name: city.name, id: city.id, network: 0, city: city.name }))[0]
    }))
    res.status(200).json([...cities, ...results].sort(function (a, b) {
        var textA = a.stop_name.toUpperCase();
        var textB = b.stop_name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    }))
}
