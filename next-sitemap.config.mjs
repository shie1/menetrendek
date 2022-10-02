/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://menetrendek.shie1bi.hu',
    generateRobotsTxt: true,
}

export default config