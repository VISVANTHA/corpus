# Metric coverage — RidgeAtlas (`CE-N21-009`)

Node.js **21**. Combo sheet unique metrics: **18**.
WB-060 Path Execution Trace is not listed for JavaScript combo rows.

| Metric | Technique | Tool | Evidence |
| --- | --- | --- | --- |
| Multi-Point Failure Probability | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Redundancy Localization | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Structural Cleanliness Score | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Test Suite Streamlining | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Abstraction Potential | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Regression Focus Mapping | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Synchronization Verification | Code Duplication | jscpd | `http-errors.js` + `http-errors-legacy.js` |
| Best Practice Compliance | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Entry Point Sanitization | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Sensitive Information Tracking | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Access Control Verification | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Supply Chain Security | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Regulatory Alignment | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Exploit Surface Identification | Static Vulnerabilities (SAST) | eslint-plugin-security | `src/auth.js`, `src/sanitize.js` |
| Logic Error Sensitivity | Mutation Score | StrykerJS + Mocha | `stryker.conf.json` mutates policy |
| Test Rigor Assessment | Mutation Score | StrykerJS + Mocha | `stryker.conf.json` mutates policy |
| Weak Spot Localization | Mutation Score | StrykerJS + Mocha | `stryker.conf.json` mutates policy |
| Boundary Mutant Analysis | Mutation Score | StrykerJS + Mocha | `stryker.conf.json` mutates policy |
