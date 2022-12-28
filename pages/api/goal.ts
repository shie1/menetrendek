// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let info: any = {
    }
    res.setHeader("Cache-Control", "public, max-age=21600, immutable")
    const browser = await launch({ headless: false, args: ["--no-sandbox"] })
    const page = await browser.newPage();
    await page.goto("https://ko-fi.com/menetrendekinfo", { waitUntil: "load" });
    const box = await page.waitForSelector("div.p-16.pn-flex.simple-panel.text-center div.kfds-lyt-width-100")
    const goal: string[] = (await box?.evaluate((elem) => elem.innerText))?.split("\n")!
    info.title = goal[0]
    info.percentage = parseInt(goal[1].replace('%', ''))
    info.goal = parseInt(goal[2].match(/\$([0-9]+)/)![1])
    info.description = goal[4]
    browser.close()
    res.status(200).json(info)
}
