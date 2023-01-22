// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { runs } from '../../client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = req.body
    res.status(200).json(await runs(rb.id, rb.date, rb.sls, rb.els))
}