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
    "theme_color": "#9C36B5",
    "background_color": "#25262B",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "icons": [
        {
            "src": "/favicon-16x16.png",
            "sizes": "16x16",
            "type": "image/png"
        },
        {
            "src": "/favicon-32x32.png",
            "sizes": "32x32",
            "type": "image/png"
        },
        {
            "src": "/apple-touch-icon.png",
            "sizes": "180x180",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
    ],
    "start_url": "/",
    "lang": "hu-HU",
    "splash_pages": null
}
export default manifest;