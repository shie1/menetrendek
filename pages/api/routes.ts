// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routes } from '../../client'
import { Stop } from '../../components/stops'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = JSON.parse(req.body) 
    res.status(200).json(await routes(rb))
}
