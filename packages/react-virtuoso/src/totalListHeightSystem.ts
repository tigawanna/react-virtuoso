import { domIOSystem } from './domIOSystem'
import { listStateSystem } from './listStateSystem'
import * as u from './urx'

export const totalListHeightSystem = u.system(
  ([{ fixedFooterHeight, fixedHeaderHeight, footerHeight, headerHeight }, { listState }]) => {
    const totalListHeightChanged = u.stream<number>()
    const totalListHeight = u.statefulStreamFromEmitter(
      u.pipe(
        u.combineLatest(footerHeight, fixedFooterHeight, headerHeight, fixedHeaderHeight, listState),
        u.map(([footerHeight, fixedFooterHeight, headerHeight, fixedHeaderHeight, listState]) => {
          return footerHeight + fixedFooterHeight + headerHeight + fixedHeaderHeight + listState.offsetBottom + listState.bottom
        })
      ),
      0
    )

    u.connect(u.duc(totalListHeight), totalListHeightChanged)

    return { totalListHeight, totalListHeightChanged }
  },
  u.tup(domIOSystem, listStateSystem),
  { singleton: true }
)
