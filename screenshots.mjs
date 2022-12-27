import { KnownDevices, launch } from "puppeteer";
import { existsSync, fstat, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import { exit } from "process";
import path from "path"

const isArray = (a) => Array.isArray(a)

const generateScreenshots = async (resolutions, pages) => {
    // resolutions: Array<Array<number>>
    // pages: Array<{url:string; focusedElement:string (querySelector)}>
    let screenshots = {}
    const browser = await launch({ headless: true })
    const page = await browser.newPage();
    await page.setCookie({ name: "install-declined", value: "true", domain: "menetrendek.info", path: "/" })
    for (let resolution of resolutions) {
        let pagesChecked = []
        let name
        if (!isArray(resolution)) {
            name = resolution.name.replace(" ", "_")
            await page.emulate(resolution)
        } else {
            name = `${resolution[0]}x${resolution[1]}`
            await page.setViewport({ width: resolution[0], height: resolution[1] })
        }
        screenshots[name] = {}
        for (let pageprop of pages) {
            const start = performance.now()
            let { url, customActions } = pageprop
            let pageName = (new URL(url)).pathname.split("/")[1] || "root"
            const times = pagesChecked.filter((e) => e == pageName).length
            pagesChecked.push(pageName)
            if (times > 0) {
                pageName = `${pageName}-${times}`
            }
            await page.goto(url, { waitUntil: "load" })
            if (customActions) { await customActions(page) }
            const { width, height, deviceScaleFactor } = page.viewport()
            console.log(`${pageName} on ${name} in ${((performance.now() - start) / 1000).toFixed(2)}s`)
            screenshots[name][pageName] = { image: await page.screenshot({ type: 'jpeg', quality: 100, captureBeyondViewport: true, fromSurface: true }), resolution: [width * (deviceScaleFactor || 1), height * (deviceScaleFactor || 1)], url: url }
        }
    }
    return screenshots
}

var date = new Date()
date.setDate(date.getDate() + 1);
date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

generateScreenshots(
    [
        KnownDevices["iPhone 11"],
        [1920, 1080]
    ],
    [
        { url: "https://menetrendek.info/" },
        {
            url: "https://menetrendek.info/map", customActions: async (page) => {
                await page.waitForTimeout(1500)
            }
        },
        {
            url: `https://menetrendek.info/routes?fs=1357&ts=486&d=${date}`, customActions: async (page) => {
                await page.click("button.mantine-Accordion-control")
                await page.waitForSelector(".mantine-Skeleton-root > button")
                if (page.viewport().isMobile) {
                    const selector = ".mantine-1yywajb"
                    await page.evaluate((s) => {
                        document.querySelector(s).scrollIntoView({ block: 'center' })
                    }, selector)
                    await page.waitForTimeout(1000)
                }
            }
        },
        {
            url: `https://menetrendek.info/routes?fs=1357&ts=486&d=${date}`, customActions: async (page) => {
                await page.click("button.mantine-Accordion-control")
                await page.waitForTimeout(1500)
                await (await page.waitForSelector(".mantine-Skeleton-root > button")).click()
                await page.waitForSelector(".mantine-Timeline-item")
                await page.waitForTimeout(1500)
                if (page.viewport().isMobile) {
                    const selector = 'div[id^="map"]'
                    await page.evaluate((s) => {
                        document.querySelector(s).scrollIntoView({ block: 'center' })
                    }, selector)
                    await page.waitForTimeout(1000)
                }
            }
        },
    ]
).then((e) => {
    if (!existsSync("./public/screenshots")) { mkdirSync("./public/screenshots") }
    const files = readdirSync("./public/screenshots")
    for (const file of files) {
        unlinkSync(path.join("./public/screenshots", file))
    }

    let manifestItems = []
    for (let res of Object.keys(e)) {
        for (let page of Object.keys(e[res])) {
            const { image, resolution, url } = e[res][page]
            const fileName = `screenshot-${res}-${page}.jpg`
            writeFileSync(`./public/screenshots/${fileName}`, image)
            manifestItems.push({
                "src": `/screenshots/${fileName}`,
                "sizes": `${resolution[0]}x${resolution[1]}`,
                "type": "image/jpg",
                "label": url
            })
        }
    }
    console.log(manifestItems)
    writeFileSync("./public/screenshots/assets.json", JSON.stringify(manifestItems))
    exit()
})