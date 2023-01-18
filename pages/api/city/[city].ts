// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../components/mysql'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const city = req.query.city
    if (!city) {
        res.status(400).json({ error: 'No city provided' }); return
    }
    const city_details = await query(`SELECT * FROM cities WHERE name = ?;`, [city?.toString().substring(0, 1).toUpperCase() + city?.toString().substring(1)])
    const stops = await query(`SELECT * FROM stops WHERE city = ? LIMIT 100;`, [city_details[0].id])
    console.log(city_details)
    res.status(200).json({ city: city_details, stops })
}
