// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"
import { Readable } from 'stream';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await launch()
    const page = await browser.newPage();
    await page.goto(`https://menetrendek.shie1bi.hu/render?${(new URLSearchParams(req.query as any)).toString()}`);
    await page.waitForSelector("#done");
    Readable.from(await (await page.$("#renderBox"))?.screenshot({ type: 'jpeg', quality: 80 }) as Buffer).pipe(res)
}
