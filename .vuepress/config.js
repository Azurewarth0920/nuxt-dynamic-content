module.exports = {
  title: 'Nuxt dynamic content',
  description: 'Generate nuxt static site with dynamic resources',
  base: '/nuxt-dynamic-content/',
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-176277165-1',
      },
    ],
  ],
  dest: 'docs',
  themeConfig: {
    repo: 'Azurewarth0920/nuxt-dynamic-content',
    docsDir: 'docs',
    nav: [
      {
        text: 'Getting Started',
        link: '/getting-start',
      },
      {
        text: 'Examples',
        link: '/examples',
      },
      {
        text: 'FAQs',
        link: '/faqs',
      },
    ],
    sidebar: [
      {
        title: 'Guide',
        children: ['/', '/getting-start', '/examples'],
      },
    ],
  },
}
