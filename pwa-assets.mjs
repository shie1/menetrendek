// npx pwa-asset-generator --background "linear-gradient(45deg, #4263eb 0%, #1098ad 100%)" ./assets/tabler-road-sign.svg ./public/pwa/
import { generateImages } from "pwa-asset-generator";
import { existsSync, mkdirSync, writeFileSync } from "fs";

generateImages("./assets/tabler-road-sign.svg", "./public/pwa/", { background: "linear-gradient(45deg, #4263eb 0%, #1098ad 100%)" }).then((e) => {
    writeFileSync("./public/pwa/assets.json", JSON.stringify(e))
    if (!existsSync("./builtComponents")) { mkdirSync("./builtComponents/") }
    writeFileSync("./builtComponents/pwa.tsx", `import parse from "html-react-parser";\nexport const PWAAssets = () => (<>{() => parse(\`${e.htmlMeta.appleLaunchImage.replace(/public\//g, '/')}${e.htmlMeta.appleMobileWebAppCapable}${e.htmlMeta.appleTouchIcon.replace(/public\//g, '/')}\`)}</>)`)
    exit()
})