// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../components/mysql'
import { apiCall } from '../../../components/api'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const topCities = await query(`SELECT c.name, co.name as county, c.id, count(s.city) as stops FROM cities AS c LEFT OUTER JOIN stops AS s ON s.city = c.id LEFT OUTER JOIN counties as co ON c.county=co.id GROUP BY c.id ORDER BY stops DESC LIMIT 15;`,)
    res.status(200).json(await Promise.all(topCities.map(async (city: any) => {
        const id = (await apiCall("GET", "https://www.wikidata.org/w/api.php", { action: "query", srsearch: city.name, list: "search", format: "json" })).query.search.find((item: any) => item.snippet.includes("Hungary")).title
        const claims: Array<any> = (await apiCall("GET", "https://www.wikidata.org/w/api.php", { action: "wbgetclaims", property: "P18", entity: id, format: "json" })).claims.P18
        const filename = (claims.find((e) => e.rank === 'preferred'))
            ? claims.find((e) => e.rank === 'preferred').mainsnak.datavalue.value : claims[0].mainsnak.datavalue.value
        const image = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}`
        return { ...city, image }
    })))
}