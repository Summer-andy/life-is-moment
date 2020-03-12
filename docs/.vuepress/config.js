module.exports = {
  title: 'life is moment',
  description: '把所有的不快留给昨天,把所有的努力付诸于今天,把所有的希望寄托给明天。',
  dest: 'public',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no'
      }
    ]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/',
        icon: 'reco-home'
      },
      {
        text: 'TimeLine',
        link: '/timeline/',
        icon: 'reco-date'
      },
      {
        text: 'Contact',
        icon: 'reco-message',
        items: [
          {
            text: 'NPM',
            link: 'https://www.npmjs.com/package/react-loadingg',
            icon: 'reco-npm'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/sixiaodong123',
            icon: 'reco-github'
          },
          {
            text: 'juejin',
            link: 'https://juejin.im/user/5b6fcd25e51d456686725149',
            icon: 'reco-juejin'
          }
        ]
      }
    ],
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,
        text: 'Category'
      },
      tag: {
        location: 3,
        text: 'Tag'
      }
    },
    friendLink: [
      {
        title: 'react-loadingg',
        desc: '一款精美的Loading组件库',
        email: '3450236968@qq.com',
        link: 'https://www.npmjs.com/package/react-loadingg'
      }
      // {
      //   "title": "起风了唯有努力生存",
      //   "desc": "A simple and beautiful vuepress Blog & Doc theme.",
      //   "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      //   "link": "https://vuepress-theme-reco.recoluan.com"
      // }
    ],
    // "logo": "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    sidebar: 'auto',
    lastUpdated: 'Last Updated',
    author: 'andy',
    authorAvatar: '/avatar.png',
    startYear: '2019'
  },

  markdown: {
    lineNumbers: true,
    // markdown-it-anchor 的选项
    anchor: { permalink: false },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },
    extendMarkdown: md => {
      // 使用更多的 markdown-it 插件!
      md.use(require('markdown-it'));
    }
  }
};
