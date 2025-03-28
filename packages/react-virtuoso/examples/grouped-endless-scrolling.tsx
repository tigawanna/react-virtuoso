import { faker } from '@faker-js/faker'
import { groupBy } from 'lodash'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Components, GroupedVirtuoso } from '../src'

const getUser = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    avatar: faker.internet.avatar(),
    description: faker.company.catchPhrase(),
    initials: `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`,
    name: `${firstName} ${lastName}`,
  }
}

type User = ReturnType<typeof getUser>

const sortUser = (a: User, b: User) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

const useGroupedUsers = (count: number) => {
  const allUsers = useMemo(() => Array.from({ length: count }, getUser).sort(sortUser), [count])

  const loadedCount = useRef(0)
  const loadedUsers = useRef<User[]>([])
  const groups = useRef<string[]>([])
  const [endReached, setEndReached] = useState(false)
  const [groupCounts, setGroupCounts] = useState<number[]>([])

  const loadMore = useCallback(() => {
    if (!endReached) {
      setTimeout(() => {
        loadedCount.current += 50

        // in a real world scenario, you would fetch the next
        // slice and append it to the existing records
        loadedUsers.current = allUsers.slice(0, loadedCount.current)

        // the code below calculates the group counts
        // for the users loaded so far;
        // this should be performed on the server too
        const groupedUsers = groupBy(loadedUsers.current, (user) => user.name[0])
        groups.current = Object.keys(groupedUsers)
        setGroupCounts(Object.values(groupedUsers).map((users) => users.length))

        if (loadedCount.current === count) {
          setEndReached(true)
        }
      }, 30)
    }
  }, [allUsers, endReached, count])

  return {
    endReached,
    groupCounts,
    groups: groups.current,
    loadMore,
    users: loadedUsers.current,
  }
}

const components: Partial<Components> = {
  Footer: () => <div>Footer</div>,

  Group: ({ children, ...props }) => {
    return <div {...props}>{children}</div>
  },

  Item: ({ children, ...props }) => {
    return (
      <div {...props} style={{ margin: 0 }}>
        {children}
      </div>
    )
  },

  List: React.forwardRef(({ children, style }, listRef) => {
    return (
      <div ref={listRef} style={style}>
        {children}
      </div>
    )
  }),
}
const Style = { height: '350px', width: '300px' }

export function Example() {
  const { groupCounts, groups, loadMore, users } = useGroupedUsers(12500)

  useEffect(loadMore, [loadMore])

  return (
    <GroupedVirtuoso
      components={components}
      endReached={(_) => {
        loadMore()
      }}
      groupContent={(index) => <div>Group {groups[index]}</div>}
      groupCounts={groupCounts}
      itemContent={(index) => (
        <div>
          <div>
            <strong>{users[index].name}</strong>
          </div>
          <div>
            {users[index].description}
            {users[index].description}
          </div>
        </div>
      )}
      overscan={400}
      style={Style}
    />
  )
}
