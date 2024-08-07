const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  reporter: 'cypress-multi-reporters',
    reporterOptions: {
    configFile: 'reporter-config.json',
  },

  env: {
    username: 'stas@stas.stas',
    password: 'stas',
    //URL used as prefix for cy.visit() or cy.request() command's URL
    apiURL: 'https://conduit-api.bondaracademy.com'
  },
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  },
});