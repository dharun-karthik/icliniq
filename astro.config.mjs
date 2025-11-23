// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Adapter is required for server-side rendering of dynamic API routes and the UI to be pre-rendered
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
});
