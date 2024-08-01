// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  css: ['~/global.css'],
  // devtools: { enabled: true },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
  ]

})