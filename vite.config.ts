import { defineConfig } from 'vite';

export default defineConfig({
    root: "src",
    base: "/modules/pf2e-creature-sounds/",
    build: {
      outDir: '../dist', 
      emptyOutDir: true,
      minify: false,
      lib: {
        entry: 'hooks.ts',
        name: 'PF2e Creature Sounds',
        formats: ['es'] 
      }
    }
  });