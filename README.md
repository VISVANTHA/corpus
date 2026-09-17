# JS_V21_VITE_NPM_MONO

Part of the `javascript-combos` white-box test-repo corpus (GraniteMill /
`granite-mill`, domain: Community garden plots).

- **Node.js:** 21.7.3 (family V21)
- **Bundler:** Vite (built as esbuild)
- **Package manager:** npm
- **Architecture:** Monolith

The application code under `src/` (or `packages/*/src/` for Microservices
branches) is byte-identical across all 576 branches of this corpus; only the
build tool, package manager, architecture layout, and the resolved tool-pin
table below vary.

## Resolved tool pins for Node 21

| Block | Primary | Alternative |
| --- | --- | --- |
| Cyclomatic Complexity | Lizard | cyclomatic-complexity 1.2.5 |
| Cognitive Complexity | eslint-plugin-sonarjs 4.2.1 | cognitive-complexity-ts 0.8.2 |
| Code Duplication | jscpd 5.2.1 | Dolos 2.9.3 |
| Lint / Rule Violations | eslint 9.39.5 | oxlint 1.16.0 |
| Static Vulnerabilities (SAST) | eslint-plugin-security 4.0.1 | OpenGrep |
| Dependency Risk (SCA) | npm audit + npm ls | trivy |
| Statement Coverage | nyc + mocha 17.1.0 | monocart-coverage-reports 2.13.0 |
| Branch Coverage | nyc + mocha 17.1.0 | monocart-coverage-reports 2.13.0 |
| Path Coverage | nyc + mocha (branch-coverage proxy) 17.1.0 | monocart-coverage-reports 2.13.0 |
| Mutation Score | StrykerJS + Mocha 9.6.1 | gutcheck 0.10.0 |
| Coverage Delta | diff-cover | monocart-coverage-reports 2.13.0 |
| All Definition Coverage | ESLint (eslint-scope) 8.4.0 | knip 5.88.1 |
| All Uses Coverage | ESLint (eslint-scope) 8.4.0 | knip 5.88.1 |
| Code Churn | pydriller | Git-Spark 1.3.0 |

See `javascript-repos-build-contract.md` in the Testable (Tools) project for
the full 103-metric roster, the repair notes, and the live pin-resolution
method (npm registry `engines.node` ranges, prereleases excluded).
