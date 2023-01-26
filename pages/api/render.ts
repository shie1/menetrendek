// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"
import { Readable } from 'stream';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await launch({ headless: true, args: ["--no-sandbox"] })
    const page = await browser.newPage();
    await page.setViewport({
        width: 6000,
        height: 6000,
        deviceScaleFactor: 2,
    })
    res.setHeader("Content-Type", `image/webp`)
    res.setHeader("Cache-Control", "public, max-age=604800, immutable")
    await page.goto(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://menetrendek.info"}/render?${(new URLSearchParams(req.query as any)).toString()}`, { waitUntil: "load" });
    Readable.from(await (await page.$("#renderBox"))?.screenshot({ type: 'webp', quality: 90, captureBeyondViewport: true, fromSurface: true }) as Buffer).pipe(res)
    browser.close()
}