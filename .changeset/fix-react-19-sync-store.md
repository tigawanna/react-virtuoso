---
'react-virtuoso': patch
---

Fix useSyncExternalStore detection for React 19+

The version check used `startsWith('18')` which excluded React 19, causing it to fall back to the legacy useState+useLayoutEffect subscription path. This could cause tearing issues in concurrent rendering scenarios. Changed to `parseInt(React.version) >= 18` to correctly use useSyncExternalStore for React 18 and above.
