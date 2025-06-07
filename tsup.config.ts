import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    dts: false,
    sourcemap: true,
    clean: false,
    target: 'es2020',
    platform: 'node',
    treeshake: true,
    splitting: false,
    bundle: true,
    external: [],
  },
  // CommonJS build
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    dts: false,
    sourcemap: true,
    clean: false,
    target: 'es2020',
    platform: 'node',
    treeshake: true,
    splitting: true,
    bundle: true,
    external: [],
  },
  // Type definitions
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist/types',
    dts: {
      only: true,
    },
    clean: true,
    target: 'es2020',
    platform: 'node',
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist/types',
    dts: {
      only: true,
    },
    clean: true,
    target: 'es2020',
    platform: 'node',
  },
]);
