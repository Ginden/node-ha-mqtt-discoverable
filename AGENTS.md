# Repository Guidelines

## Project Structure & Module Organization

The maintained library lives in `src/`. Core MQTT discovery behavior is in top-level modules such as `discoverable.ts` and `subscriber.ts`; entity implementations are grouped under `src/sensors/<entity>/`, settings under `src/settings/`, reusable types under `src/types/`, and helpers under `src/utils/`. Public exports are assembled through `src/index.ts` and nested `index.ts` files. Keep tests beside their subjects as `*.spec.ts`. `examples/blinkstick/` contains a runnable consumer example, while `py-source/` preserves the original Python implementation as reference. Build artifacts are generated in `dist/` and should not be edited directly.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions from `package-lock.json`.
- `npm run build` bundles CommonJS and ESM output, declarations, and source maps with tsup.
- `npm test` runs all Vitest suites once.
- `npm run check:ts` performs strict TypeScript checking without emitting files.
- `npm run lint` checks `src/` with ESLint; `npm run lint:fix` applies safe fixes.
- `npm run prettier:check` verifies formatting; `npm run prettier` rewrites supported files.
- `npm run verify` runs linting, tests, formatting checks, and type checking concurrently. Run it before pushing; the Husky pre-push hook does the same.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, single quotes, and a 100-character print width, as enforced by Prettier. Use PascalCase for classes and exported types, camelCase for methods and variables, and lowercase kebab-case filenames such as `binary-sensor-info.ts`. Follow the configured member ordering and preserve explicit public exports. Model new Home Assistant entities after an existing `src/sensors/` pair rather than duplicating MQTT plumbing.

## Testing Guidelines

Vitest provides `suite`, `test`, `expect`, and mocks. Name tests after observable behavior and place them in a neighboring `*.spec.ts` file. Cover configuration serialization, MQTT interactions, events, and reconnect/error behavior as applicable. No coverage threshold is enforced, so add focused regression tests for every behavior change.

## Commit & Pull Request Guidelines

Recent history favors Conventional Commit-style subjects such as `feat:`, `fix:`, and scoped forms like `feat(ha-discoverable):`; release commits may contain only a version. Keep commits focused and imperative. Pull requests should explain the user-visible change, identify affected entities or topics, link relevant issues, and note tests run. Include logs or payload examples when MQTT behavior changes; screenshots are only useful for documentation rendering changes. Ensure `npm run verify` and `npm run build` pass before requesting review.
