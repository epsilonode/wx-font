import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno({
      dark: 'class'
    })
  ],
  content: {
    filesystem: ['src/routes/**/*.{svelte,ts,js,html}', 'src/app.html']
  }
});
