import * as React from 'react'

import { Virtuoso } from '../src'

const FancyScroller = React.forwardRef(({ children, ...props }: { children?: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div style={{ border: '1px solid pink' }}>
      <div {...props} ref={ref}>
        {children}
      </div>
    </div>
  )
})

export function Example() {
  return (
    <Virtuoso
      components={{
        Scroller: FancyScroller,
      }}
      computeItemKey={(key) => `item-${key}`}
      itemContent={(index) => <div style={{ height: 30 }}>Item {index}</div>}
      style={{ height: 300 }}
      totalCount={100}
    />
  )
}
