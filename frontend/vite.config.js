import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT
  },
  // Log port for debugging
  build: {
    // This will log the port to your Heroku logs when the app starts.
    postcss: {
      plugins: [
        {
          plugin: {
            transform: (content) => {
              console.log(`App is running on port: ${process.env.PORT}`);
              return content;
            },
          },
        },
      ],
    },
  },
});