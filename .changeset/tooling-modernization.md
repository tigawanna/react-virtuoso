---
'react-virtuoso': patch
'@virtuoso.dev/gurx': patch
'@virtuoso.dev/masonry': patch
'@virtuoso.dev/reactive-engine-core': patch
'@virtuoso.dev/reactive-engine-query': patch
'@virtuoso.dev/reactive-engine-react': patch
'@virtuoso.dev/reactive-engine-router': patch
'@virtuoso.dev/reactive-engine-storage': patch
---

Replace ESLint and Prettier with oxlint and oxfmt for faster linting and formatting. Modernize TypeScript configuration with `verbatimModuleSyntax` and ES2022 build targets.

Source code changes are non-behavioral: stricter equality checks (`===`/`!==` instead of truthiness), `??` instead of `||` for defaults, early returns instead of else blocks, self-closing JSX tags, and removal of unnecessary JSX fragments. `LogLevel` in react-virtuoso is changed from a TypeScript enum to a const object — the named exports (`LogLevel.DEBUG`, etc.) work identically, but enum reverse-mapping (`LogLevel[0]`) is no longer supported.
