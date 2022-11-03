/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://menetrendek.ifno',
    generateRobotsTxt: true,
}

export default config