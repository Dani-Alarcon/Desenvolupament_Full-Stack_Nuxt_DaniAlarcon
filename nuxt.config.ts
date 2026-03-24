export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  runtimeConfig: {
    oauth: {
      github: {
        clientId: "",
        clientSecret: "",
      },
    },
  },
  routeRules: {
    '/auth/**': { cors: true },
    '/api/**': { cors: true }
  }
});