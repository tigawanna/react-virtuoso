# Virtuoso Tooling

This package contains shared tooling configuration for Virtuoso projects:

- ESLint configuration
- Prettier configuration

## Usage

Add the package as a dev dependency:

```bash
npm install --save-dev @virtuoso.dev/tooling
```

### ESLint

In your project's `eslint.config.mjs`:

```js
import virtuosoEslintConfig from '@virtuoso.dev/tooling/eslint.config.mjs'

export default [...virtuosoEslintConfig]
```

### TypeScript

The shared TypeScript base configuration lives at the repository root (`tsconfig.base.json`). Extend it in your project's `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"]
}
```
