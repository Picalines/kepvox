import { type Page, expect, test } from '@playwright/test'
import { getStoryUrl } from './story-url'

type Theme = 'light' | 'dark'

type TestStoryParams = {
  title: string
  story: string | string[]
  skip?: { reason: string }
  windowSize?: { width: number; height: number }
  fullPage?: boolean
  selector?: string
  args?: Record<string, unknown>
  theme?: Theme | Theme[]
  act?: (page: Page) => Promise<void> | void
}

export const testStory = (params: TestStoryParams) => {
  const {
    title,
    story: storyParam,
    skip,
    windowSize,
    fullPage = false,
    selector = '#storybook-root',
    args: storyArgs = {},
    theme: themeParam = 'light',
    act,
  } = params

  const stories = typeof storyParam === 'string' ? [storyParam] : storyParam
  const themes = typeof themeParam === 'string' ? [themeParam] : themeParam

  for (const story of stories) {
    const storyUrl = getStoryUrl({ title, story, args: storyArgs })

    for (const theme of themes) {
      const testName = [story, windowSize ? `${windowSize.width}x${windowSize.height}` : null, theme]
        .filter(Boolean)
        .join(' ')

      test.describe(title, async () => {
        test(testName, async ({ page }) => {
          test.skip(Boolean(skip), skip?.reason)

          await page.goto(storyUrl.toString())

          await page
            .locator('#storybook-root > *')
            .or(page.locator('#storybook-root', { hasText: /./ }))
            .first()
            .waitFor({ state: 'attached' })

          if (windowSize) {
            await page.setViewportSize(windowSize)
          }

          // Disable animations
          await page.evaluate(() => {
            // @ts-expect-error
            Element.prototype.getAnimations = undefined
            // @ts-expect-error
            Element.prototype.animate = undefined
          })

          if (theme === 'dark') {
            await page.locator(':root').evaluate(root => root.classList.add('dark'))
          }

          const target = page.locator(selector)
          await target.waitFor()

          await act?.(page)

          if (fullPage) {
            await expect(page).toHaveScreenshot({ animations: 'disabled', fullPage: true })
          } else {
            await expect(target).toHaveScreenshot({ animations: 'disabled' })
          }
        })
      })
    }
  }
}
