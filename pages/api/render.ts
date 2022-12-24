// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"
import { Readable } from 'stream';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await launch({ headless: true })
    const page = await browser.newPage();
    await page.setViewport({
        width: 3000,
        height: 3000,
    })
    res.setHeader("Content-Type", `image/jpg`)
    res.setHeader("Cache-Control", "public, max-age=604800, immutable")
    await page.goto(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/render?${(new URLSearchParams(req.query as any)).toString()}`);
    await page.reload({ waitUntil: 'domcontentloaded' })
    Readable.from(await (await page.$("#renderBox"))?.screenshot({ type: 'jpeg', quality: 100, captureBeyondViewport: true, fromSurface: true }) as Buffer).pipe(res)
}
