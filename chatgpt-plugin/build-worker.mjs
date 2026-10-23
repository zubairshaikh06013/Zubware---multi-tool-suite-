import { build } from 'esbuild';
await build({entryPoints:[new URL('./worker.mjs',import.meta.url).pathname],outfile:new URL('./worker-dist/index.mjs',import.meta.url).pathname,bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,loader:{'.html':'text'},external:['node:*']});
