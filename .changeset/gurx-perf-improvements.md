---
'@virtuoso.dev/gurx': patch
---

Reduce per-publish CPU cost and fix memory leaks in the reactive engine

- Cache `combineCells()` by source set to prevent orphaned graph nodes on repeated calls
- Clean up `subMultiple()` synthetic nodes on unsubscribe
- Fast-path `pub()` to skip object allocation for single-node publishes
- Replace full state map clone with dirty-state overlay in `pubIn`
- Pre-compute source+pull node arrays on projections to avoid per-node array allocations
- Merge double `Object.getOwnPropertySymbols` iteration in `pubIn` into a single loop
- Replace `indexOf`/`splice` with skip-set in `nodeWillNotEmit` propagation
- Lift `inContext` to wrap entire `pubIn` propagation loop
- Skip empty `RealmProvider` publishes when no `updateWith` is provided
- Memoize `getSnapshot` in `useCellValueWithStore` for stable `useSyncExternalStore` identity
