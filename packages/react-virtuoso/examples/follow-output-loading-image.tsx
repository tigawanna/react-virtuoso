import * as React from 'react'
import { useCallback, useState } from 'react'

import { Virtuoso, VirtuosoHandle } from '../src'

const Image = ({ index }: { index: number }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (index > 99) {
      setTimeout(() => {
        ref.current!.style.height = '300px'
        ref.current!.dispatchEvent(new Event('customLoad', { bubbles: true }))
      }, 500)
    }
  })
  return (
    <div ref={ref} style={{ height: 30 }}>
      Item {index}
    </div>
  )
}
export function Example() {
  const [count, setCount] = useState(100)
  const ref = React.useRef<HTMLDivElement>(null)
  const virtuosoRef = React.useRef<VirtuosoHandle>(null)
  const itemContent = useCallback((index: number) => {
    return <Image index={index} />
  }, [])

  React.useEffect(() => {
    ref.current!.addEventListener('customLoad', () => {
      virtuosoRef.current?.autoscrollToBottom()
    })
  }, [])

  return (
    <div ref={ref}>
      <div>
        <button
          data-testid="add-image"
          onClick={() => {
            setCount((count) => count + 1)
          }}
        >
          Append Image
        </button>{' '}
        |{' '}
      </div>
      <Virtuoso
        followOutput={'auto'}
        initialTopMostItemIndex={99}
        itemContent={itemContent}
        ref={virtuosoRef}
        style={{ height: 500 }}
        totalCount={count}
      />
    </div>
  )
}
