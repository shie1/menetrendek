// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { exposition } from '../../client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const rb = JSON.parse(req.body)
    res.status(200).json(await exposition(rb["runs"], rb["nativeData"], rb["datestring"]))
}