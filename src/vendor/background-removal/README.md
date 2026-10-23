# IMG.LY background removal 1.7.0: Zod 4 maintenance patch

This directory contains the original browser-engine sources embedded in the
published `@imgly/background-removal@1.7.0` ESM source map. `UPSTREAM.json` records
the package, source-map hash and original per-file hashes. The upstream license
is retained in `LICENSE.md`; this maintenance patch remains under AGPL-3.0.

Upstream: https://github.com/imgly/background-removal-js

Zubware modifications, 24 October 2026:

- Compile these sources through the application build instead of shipping the
  upstream prebuilt bundle, which embeds vulnerable Zod 3 even if its npm
  dependency is overridden.
- Use patched Zod 4.6.7. Migrate the progress-function schema to Zod 4 while
  retaining argument/return validation, and use `prefault` so omitted config,
  output defaults and model aliases continue to be validated and transformed.
- Keep local upstream package metadata at version 1.7.0 so default model and
  WASM URLs remain unchanged. Segmentation, codecs and inference sources are
  otherwise unmodified; no paid service or new model is introduced.
- Add a module entry point exporting the unchanged v1 API.

The package's former transitive runtime dependencies are explicit, pinned
application dependencies. The source is published with the application at:
https://github.com/zubairshaikh06013/Zubware---multi-tool-suite-/tree/main/src/vendor/background-removal

Validation: `node --import tsx scripts/testBackgroundRemovalConfig.ts`, production
build, TypeScript checks and the existing tool regressions. Keep the source
and this notice available when distributing the compiled engine.
