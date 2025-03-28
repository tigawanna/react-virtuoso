import { tupleComparator } from './comparators'
import { domIOSystem } from './domIOSystem'
import { DOWN, ScrollDirection, UP } from './stateFlagsSystem'
import * as u from './urx'

export type NumberTuple = [number, number]
export type Overscan = number | { main: number; reverse: number }
export const TOP = 'top'
export const BOTTOM = 'bottom'
export const NONE = 'none'
export type ChangeDirection = typeof DOWN | typeof NONE | typeof UP
export type ListEnd = typeof BOTTOM | typeof TOP
export type ViewportIncrease = number | Partial<Record<ListEnd, number>>

export function getOverscan(overscan: Overscan, end: ListEnd, direction: ScrollDirection) {
  if (typeof overscan === 'number') {
    return (direction === UP && end === TOP) || (direction === DOWN && end === BOTTOM) ? overscan : 0
  } else {
    if (direction === UP) {
      return end === TOP ? overscan.main : overscan.reverse
    } else {
      return end === BOTTOM ? overscan.main : overscan.reverse
    }
  }
}

function getViewportIncrease(value: ViewportIncrease, end: ListEnd) {
  return typeof value === 'number' ? value : (value[end] ?? 0)
}

export const sizeRangeSystem = u.system(
  ([{ deviation, fixedHeaderHeight, headerHeight, scrollTop, viewportHeight }]) => {
    const listBoundary = u.stream<NumberTuple>()
    const topListHeight = u.statefulStream(0)
    const increaseViewportBy = u.statefulStream<ViewportIncrease>(0)
    const overscan = u.statefulStream<Overscan>(0)

    const visibleRange = u.statefulStreamFromEmitter(
      u.pipe(
        u.combineLatest(
          u.duc(scrollTop),
          u.duc(viewportHeight),
          u.duc(headerHeight),
          u.duc(listBoundary, tupleComparator),
          u.duc(overscan),
          u.duc(topListHeight),
          u.duc(fixedHeaderHeight),
          u.duc(deviation),
          u.duc(increaseViewportBy)
        ),
        u.map(
          ([
            scrollTop,
            viewportHeight,
            headerHeight,
            [listTop, listBottom],
            overscan,
            topListHeight,
            fixedHeaderHeight,
            deviation,
            increaseViewportBy,
          ]) => {
            const top = scrollTop - deviation
            const stickyHeaderHeight = topListHeight + fixedHeaderHeight
            const headerVisible = Math.max(headerHeight - top, 0)
            let direction: ChangeDirection = NONE
            const topViewportAddition = getViewportIncrease(increaseViewportBy, TOP)
            const bottomViewportAddition = getViewportIncrease(increaseViewportBy, BOTTOM)

            listTop -= deviation
            listTop += headerHeight + fixedHeaderHeight
            listBottom += headerHeight + fixedHeaderHeight
            listBottom -= deviation

            if (listTop > scrollTop + stickyHeaderHeight - topViewportAddition) {
              direction = UP
            }

            if (listBottom < scrollTop - headerVisible + viewportHeight + bottomViewportAddition) {
              direction = DOWN
            }

            if (direction !== NONE) {
              return [
                Math.max(top - headerHeight - getOverscan(overscan, TOP, direction) - topViewportAddition, 0),
                top -
                  headerVisible -
                  fixedHeaderHeight +
                  viewportHeight +
                  getOverscan(overscan, BOTTOM, direction) +
                  bottomViewportAddition,
              ] as NumberTuple
            }

            return null
          }
        ),
        u.filter((value) => value != null) as u.Operator<null | NumberTuple, NumberTuple>,
        u.distinctUntilChanged(tupleComparator)
      ),
      [0, 0]
    ) as unknown as u.StatefulStream<NumberTuple>

    return {
      increaseViewportBy,
      // input
      listBoundary,
      overscan,
      topListHeight,

      // output
      visibleRange,
    }
  },
  u.tup(domIOSystem),
  { singleton: true }
)
