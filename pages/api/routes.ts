// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routes } from '../../client'
import { Stop } from '../../components/stops'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb: {
        from: Stop;
        to: Stop;
        hours: number;
        minutes: number;
        discount: number;
        networks: Array<number>;
        date: string
    } = JSON.parse(req.body)
    res.status(200).json(await routes(rb))
}
