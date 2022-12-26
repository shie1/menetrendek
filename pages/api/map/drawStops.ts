// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { drawStops } from '../../../client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = JSON.parse(req.body)
    res.status(200).json(await drawStops(rb.extent, rb.max, rb.radius))
}
