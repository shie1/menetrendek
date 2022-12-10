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
    "icons": [
        {
            "src": "/api/img/logo.png?s=48",
            "sizes": "48x48",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=72",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=96",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=144",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=168",
            "sizes": "168x168",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=192",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/api/img/logo.png?s=512",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        }
    ],
    "start_url": "/",
    "lang": "hu-HU",
    "splash_pages": null,
    "dir": "ltr",
    "categories": [
        "navigation",
        "travel"
    ]
}
export default manifest;