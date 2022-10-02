// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await launch()
    const page = await browser.newPage();
    await page.goto(`https://menetrendek.shie1bi.hu/render?${(new URLSearchParams(req.query as any)).toString()}`);
    await page.waitForSelector("#done");
    const img = await (await page.$("#renderBox"))?.screenshot({ encoding: 'base64' })
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img!.length
    })
    res.end(img)
}
