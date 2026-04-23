---
'react-virtuoso': patch
---

Fix `useWindowScroll` SSR layout collapse by rendering the window viewport in normal flow while preserving sticky top items.
