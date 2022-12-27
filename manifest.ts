import fs from 'fs'
import path from "path"

const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))
const pwaAssets = JSON.parse((fs.readFileSync(path.join(process.cwd(), "public/pwa/assets.json")) as any))
const screenshots = JSON.parse((fs.readFileSync(path.join(process.cwd(), "public/screenshots/assets.json")) as any))

const manifest = {
    "name": "Menetrendek",
    "short_name": pkg.name.substring(0, 1).toUpperCase() + pkg.name.substring(1),
    "author": pkg.author,
    "version": pkg.version,
    "version_name": pkg.version,
    "description": pkg.description,
    "theme_color": "#396be1",
    "background_color": "#25262B",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "screenshots": screenshots,
    "icons": pwaAssets.manifestJsonContent.map((e: any) => ({ ...e, src: e.src.replace(/public\//g, '/') })),
    "start_url": "/",
    "lang": "hu-HU",
    "splash_pages": null,
    "dir": "ltr",
    "categories": [
        "navigation",
        "travel"
    ],
    "prefer_related_applications": false,
    "related_applications": [
        {
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=app.mav.menetrend",
            "id": "app.mav.menetrend"
        },
        {
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=hu.sandorbogyo.menetrendek",
            "id": "hu.sandorbogyo.menetrendek"
        },
        {
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=hu.mavszk.vonatinfo",
            "id": "hu.mavszk.vonatinfo"
        },
        {
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=hu.donmade.menetrend.budapest",
            "id": "hu.donmade.menetrend.budapest"
        },
        {
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=hu.webvalto.bkkfutar",
            "id": "hu.webvalto.bkkfutar"
        }
    ],
    "display_override": [
        "standalone",
        "fullscreen",
        "minimal-ui"
    ]
}
export default manifest;