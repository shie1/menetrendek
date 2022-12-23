// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { geoInfo, map } from '../../client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = JSON.parse(req.body)
    res.status(200).json(await map(rb.extent, rb.max))
}
