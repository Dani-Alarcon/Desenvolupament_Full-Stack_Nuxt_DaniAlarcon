// https://nuxt.com/docs/api/configuration/nuxt-config
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
      // provider in lowercase (github, google, etc.)
      github: {
        clientId: "",
        clientSecret: "",
      },
    },
  },
  routeRules: {
    // Posem /** perquè apliqui a TOT: /api, /auth, etc.
    '/**': { 
      cors: true, 
      headers: { 
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      } 
    },
  }
});
