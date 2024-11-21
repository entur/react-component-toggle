import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, relative, extname } from 'path'
import dts from 'vite-plugin-dts'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      input: Object.fromEntries(
        glob.sync('lib/**/*.{ts,tsx}', {
          ignore: ["lib/**/*.d.ts"],
        }).map(file => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative(
            'lib',
            file.slice(0, file.length - extname(file).length)
          ),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        globals: {
          react: 'React',
        },
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        }
    },

    copyPublicDir: false
  }
})
