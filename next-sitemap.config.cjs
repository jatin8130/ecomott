/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SERVER,
  generateRobotsTxt: true,
  exclude: ["/admin*", "/user/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin*", "/user/*"],
      },
    ],
  },
};
