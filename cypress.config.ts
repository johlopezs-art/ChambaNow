import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // AGREGA ESTA LÍNEA:
    baseUrl: 'http://localhost:8100', 
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});