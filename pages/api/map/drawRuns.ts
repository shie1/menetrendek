// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { drawRuns } from '../../../client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = JSON.parse(req.body)
    res.status(200).json(await drawRuns(rb.extent, rb.max))
}
