import { describe, expect, it, vi } from 'vitest'

import { listSystem } from '../src/listSystem'
import * as u from '../src/urx'

describe('window scroller system', () => {
  it('offsets the window scroll top with the element offset top', () => {
    const { scrollTop, windowScrollContainerState, windowViewportRect } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(scrollTop, sub)
    u.publish(windowViewportRect, { offsetTop: 100, visibleHeight: 1000 })
    u.publish(windowScrollContainerState, { scrollHeight: 1000, scrollTop: 0, viewportHeight: 400 })
    expect(sub).toHaveBeenCalledWith(0)
    u.publish(windowScrollContainerState, { scrollHeight: 1000, scrollTop: 200, viewportHeight: 400 })
    expect(sub).toHaveBeenCalledWith(100)
  })

  it('offsets the scrollTo calls with offsetTop', () => {
    const { scrollTo, windowScrollTo, windowViewportRect } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(windowScrollTo, sub)
    u.publish(windowViewportRect, { offsetTop: 200, visibleHeight: 1000 })
    u.publish(scrollTo, { top: 300 })
    expect(sub).toHaveBeenCalledWith({ top: 500 })
  })

  it('offsets the scroll height with the element offset top', () => {
    const { scrollContainerState, windowScrollContainerState, windowViewportRect } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(scrollContainerState, sub)
    u.publish(windowViewportRect, { offsetTop: 60, visibleHeight: 800 })
    u.publish(windowScrollContainerState, { scrollHeight: 5000, scrollTop: 200, viewportHeight: 800 })

    expect(sub).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollHeight: 4940, // 5000 - 60
        scrollTop: 140, // 200 - 60
        viewportHeight: 800,
      })
    )
  })

  it('reports atBottom correctly when content exists above Virtuoso', () => {
    const { isAtBottom, windowScrollContainerState, windowViewportRect, atBottomThreshold } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(isAtBottom, sub)

    const offsetTop = 60
    const viewportHeight = 800
    const scrollHeight = 5000

    u.publish(atBottomThreshold, 4)
    u.publish(windowViewportRect, { offsetTop, visibleHeight: viewportHeight })

    // Scroll to the very bottom of the page:
    // At the bottom, scrollTop = scrollHeight - viewportHeight
    const scrollTopAtBottom = scrollHeight - viewportHeight
    u.publish(windowScrollContainerState, { scrollHeight, scrollTop: scrollTopAtBottom, viewportHeight })

    expect(sub).toHaveBeenLastCalledWith(true)
  })

  it('reports atBottom as false when not scrolled to bottom with offset', () => {
    const { isAtBottom, windowScrollContainerState, windowViewportRect, atBottomThreshold } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(isAtBottom, sub)

    const offsetTop = 60
    const viewportHeight = 800
    const scrollHeight = 5000

    u.publish(atBottomThreshold, 4)
    u.publish(windowViewportRect, { offsetTop, visibleHeight: viewportHeight })

    // Scroll to somewhere in the middle
    u.publish(windowScrollContainerState, { scrollHeight, scrollTop: 2000, viewportHeight })

    expect(sub).toHaveBeenLastCalledWith(false)
  })

  it('reports atBottom correctly with zero offsetTop', () => {
    const { isAtBottom, windowScrollContainerState, windowViewportRect, atBottomThreshold } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(isAtBottom, sub)

    const viewportHeight = 800
    const scrollHeight = 5000

    u.publish(atBottomThreshold, 4)
    u.publish(windowViewportRect, { offsetTop: 0, visibleHeight: viewportHeight })

    // Scroll to the very bottom
    const scrollTopAtBottom = scrollHeight - viewportHeight
    u.publish(windowScrollContainerState, { scrollHeight, scrollTop: scrollTopAtBottom, viewportHeight })

    expect(sub).toHaveBeenLastCalledWith(true)
  })

  it('reports atBottom correctly with large offsetTop', () => {
    const { isAtBottom, windowScrollContainerState, windowViewportRect, atBottomThreshold } = u.init(listSystem)
    const sub = vi.fn()
    u.subscribe(isAtBottom, sub)

    const offsetTop = 200
    const viewportHeight = 800
    const scrollHeight = 5000

    u.publish(atBottomThreshold, 4)
    u.publish(windowViewportRect, { offsetTop, visibleHeight: viewportHeight })

    // Scroll to the very bottom of the page
    const scrollTopAtBottom = scrollHeight - viewportHeight
    u.publish(windowScrollContainerState, { scrollHeight, scrollTop: scrollTopAtBottom, viewportHeight })

    expect(sub).toHaveBeenLastCalledWith(true)
  })
})
