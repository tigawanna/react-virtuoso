import styled from '@emotion/styled'
import * as React from 'react'

import { GridComponents, VirtuosoGrid, VirtuosoGridHandle } from '../src'

const ItemContainer = styled.div`
  box-sizing: border-box;
  padding: 5px;
  width: 25%;
  background: #f5f5f5;
  display: flex;
  flex: none;
  align-content: stretch;
  @media (max-width: 1024px) {
    width: 33%;
  }

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`

const ItemWrapper = styled.div`
    flex: 1;
    text-align: center;
    font-size: 80%;
    padding: 20px;
    box-shadow: 0 5px 6px -6px #777;
    background: white;
  }
`

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
` as GridComponents['List']

export function Example() {
  const ref = React.createRef<VirtuosoGridHandle>()

  return (
    <div style={{ padding: '100px' }}>
      <button
        id="start-30"
        onClick={() => {
          ref.current!.scrollToIndex({ align: 'start', index: 30 })
        }}
      >
        Start 30
      </button>
      <button
        id="center-50"
        onClick={() => {
          ref.current!.scrollToIndex({ align: 'center', index: 50 })
        }}
      >
        Center 50
      </button>
      <button
        id="end-99"
        onClick={() => {
          ref.current!.scrollToIndex({ align: 'end', index: 99 })
        }}
      >
        End 99
      </button>
      <VirtuosoGrid
        components={{
          Item: ItemContainer,
          List: ListContainer,
          ScrollSeekPlaceholder: () => (
            <ItemContainer>
              <ItemWrapper>Placeholder</ItemWrapper>
            </ItemContainer>
          ),
        }}
        itemContent={(index) => <ItemWrapper>Item {index}</ItemWrapper>}
        ref={ref}
        style={{ height: 300, width: '100%' }}
        totalCount={1000}
        useWindowScroll
      />
    </div>
  )
}
