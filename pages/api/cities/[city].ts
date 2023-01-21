// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../components/mysql'
import { apiCall } from '../../../components/api';
import axios from 'axios';
import { parse } from "node-html-parser"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const city = req.query.city
    if (!city) {
        res.status(400).json({ error: 'No city provided' }); return
    }
    try {
        const city_details = (await query('SELECT c.id as id,c.name as name,co.name as county FROM cities as c LEFT JOIN counties as co ON c.county=co.id WHERE c.name = ?;', [city?.toString().substring(0, 1).toUpperCase() + city?.toString().substring(1)]))[0]
        const stops = city_details?.id ? await query(`SELECT * FROM stops WHERE city = ? LIMIT 15;`, [city_details.id]) : []
        const id = (await apiCall("GET", "https://www.wikidata.org/w/api.php", { action: "query", srsearch: city_details.name, list: "search", format: "json" })).query.search.find((item: any) => item.snippet.includes("Hungary")).title
        const claims: Array<any> = (await apiCall("GET", "https://www.wikidata.org/w/api.php", { action: "wbgetclaims", property: "P18", entity: id, format: "json" })).claims.P18
        const filename = (claims.find((e) => e.rank === 'preferred'))
            ? claims.find((e) => e.rank === 'preferred').mainsnak.datavalue.value : claims[0].mainsnak.datavalue.value
        const image = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}`
        res.status(200).json({ ...city_details, stops, image })
    } catch (e) {
        res.status(500).json({ error: e })
    }
}
