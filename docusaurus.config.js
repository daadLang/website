// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// Base URL for assets and client scripts (keeps paths correct when site is served
// from a subpath). Update this if you change `baseUrl` below.
const BASE_URL = '/website/';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'لغة برمجة باللغة العربية',
  tagline: 'دليل ومراجع لغة ض  بالعربية',
  favicon: `${BASE_URL}img/favicon.ico`,

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://daadLang.github.io',
  baseUrl: BASE_URL,
organizationName: 'daadLang',
projectName: 'website',
deploymentBranch: 'gh-pages',
  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  // Client scripts
  scripts: [
    `${BASE_URL}js/swap-nav-logo.js`,
    `${BASE_URL}js/prism-daad.js`,
  ],
  // Client modules: bundle small client helpers (swap logos, prism extensions, etc.)
  clientModules: [
    require.resolve('./src/clientModules/swap-logo-theme.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      direction: 'rtl',
      image: `${BASE_URL}img/docusaurus-social-card.jpg`,
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'My Site Logo',
          src: `${BASE_URL}img/logo.png`,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'الدروس',
          },
          {
            to: '/download',
            position: 'left',
            label: 'تنزيل',
          },
          // {to: '/blog', label: 'المدونة', position: 'left'},
          {
            href: 'https://github.com/daadLang',
            position: 'right',
            // Use an HTML item to show the GitHub mark instead of a text label
            // add `navbar-github` class so we can target it in CSS
            html: `<img class='navbar-github' src='${BASE_URL}img/github.svg' alt='جيت هب' style='width:28px;height:28px;vertical-align:middle;'/>`,
            },
          ],
          },
          footer: {
          style: 'dark',
          links: [],
          copyright: `حقوق النشر © ${new Date().getFullYear()} ض.`,
          },
          prism: {
          theme: prismThemes.nightOwl,
          darkTheme: prismThemes.nightOwl,
          additionalLanguages: ['daad'], // أضف لغتك هنا
      },
    }),
};

export default config;
