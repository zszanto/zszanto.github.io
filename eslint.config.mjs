// Flat ESLint config (eslint 9+). `next lint` was removed in Next 16, so the
// lint script runs the ESLint CLI directly against this config.
import coreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...coreWebVitals,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
  {
    rules: {
      // react-hooks v7 flags setState directly inside effects. This codebase
      // uses that deliberately for mount-time sync from localStorage
      // (ThemeToggle) and modal reset-on-open (SearchModal) — established
      // patterns here that would need real refactors (useSyncExternalStore /
      // key-based remount) to satisfy the rule.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default config
