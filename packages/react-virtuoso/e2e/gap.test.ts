import { expect, test } from '@playwright/test'

//@ts-expect-error - type module and playwright
import { navigateToExample } from './utils.ts'

test.describe('list with hundred items', () => {
  test.beforeEach(async ({ baseURL, page }) => {
    await navigateToExample(page, baseURL, 'gap')
    await page.waitForTimeout(100)
  })

  test('renders only 6 items', async ({ page }) => {
    const itemCount = await page.evaluate(() => {
      const listContainer = document.querySelector('[data-testid=virtuoso-item-list]')!
      return listContainer.childElementCount
    })
    expect(itemCount).toBe(6)
  })

  test('fills in the scroller', async ({ page }) => {
    const scrollHeight = await page.evaluate(() => {
      const scroller = document.querySelector('[data-testid=virtuoso-scroller]')!
      return scroller.scrollHeight
    })
    expect(scrollHeight).toBe(100 * 32 + 99 * 20)
  })
})
