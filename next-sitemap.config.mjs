/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://menetrendek.info',
    generateRobotsTxt: true,
    exclude: ['/render', '/settings', '/route', '/routes', '/runs'],
}

export default config