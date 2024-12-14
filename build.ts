import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

async function build() {
  try {
    const result = await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: 'dist/server.js',
      format: 'esm',
      packages: 'bundle',
      minify: true,
      minifyWhitespace: true,
      minifySyntax: true,
      minifyIdentifiers: true,
      banner: {
        js: '#!/usr/bin/env node',
      },
      plugins: [
        nodeExternalsPlugin({
          allowList: ['hono', '@hono/node-server']
        })
      ],
      mainFields: ['module', 'main'],
    })

    console.log('Build complete:', result)
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()
