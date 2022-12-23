import fs from 'fs'
import path from "path"

const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))
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
    "screenshots": [
        {
            "src": "/api/img/mobile_1.png",
            "sizes": "1442x3202",
            "type": "image/png",
            "label": "Járatok keresése"
        },
        {
            "src": "/api/img/mobile_2.png",
            "sizes": "1442x3202",
            "type": "image/png",
            "label": "Átszállásos út kifejtve"
        },
        {
            "src": "/api/img/mobile_3.png",
            "sizes": "1442x3202",
            "type": "image/png",
            "label": "Járat megállói"
        },
        {
            "src": "/api/img/desktop_1.png",
            "sizes": "1920x937",
            "type": "image/png",
            "label": "Járatok keresése"
        },
        {
            "src": "/api/img/desktop_2.png",
            "sizes": "1920x937",
            "type": "image/png",
            "label": "Átszállásos út kifejtve"
        },
        {
            "src": "/api/img/desktop_3.png",
            "sizes": "1920x937",
            "type": "image/png",
            "label": "Járat megállói"
        },
    ],
    "icons": [
        {
            "src": "/api/img/logo_maskable.png?s=48",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=72",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=96",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=144",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=168",
            "sizes": "168x168",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=192",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_maskable.png?s=512",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/api/img/logo_monochrome.png?s=512",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "monochrome"
        },
        {
            "src": "/api/img/logo_maskable.png?s=512",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
    ],
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