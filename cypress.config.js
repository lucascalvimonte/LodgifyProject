const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://app.clickup.com/',
    defaultCommandTimeout: 10000,
    numTestsKeptInMemory: 1,
    experimentalMemoryManagement: true,
    video: false,
    screenshotOnRunFailure: false
  },
});