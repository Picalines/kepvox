import { type Page, expect, test } from '@playwright/test'
import type { Meta } from '@storybook/react'
import { getStoryUrl } from './story-url'

type Theme = 'light' | 'dark'

type Size = { width: number; height: number }

type PageAction = (page: Page) => Promise<void> | void

type TestStoryParams = {
  meta: Pick<Meta, 'title' | 'component'>
  story: string
  skip?: { reason: string }
  windowSize?: Size
  fullPage?: boolean
  selector?: string
  theme?: Theme
  backgroundColor?: string | null
  act?: PageAction
}

const DEFAULT_THEME: Theme = 'light'

export const testStory = (params: TestStoryParams) => {
  const {
    meta,
    story,
    skip,
    windowSize,
    fullPage = false,
    selector = '#storybook-root',
    theme = DEFAULT_THEME,
    backgroundColor = 'magenta',
    act,
  } = params

  const title = meta.title ?? meta.component?.displayName
  if (!title) {
    throw new Error("story title couldn't be determined")
  }

  const storyUrl = getStoryUrl({ title, story })

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

      if (backgroundColor !== null) {
        await page.locator('body').evaluate((body, color) => {
          body.style.backgroundColor = color
        }, backgroundColor)
      }

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

type TestStoryMatrixParams = Omit<TestStoryParams, 'theme' | 'story'> & {
  stories: string[]
  themes?: Theme[]
}

export const testStoryMatrix = (params: TestStoryMatrixParams) => {
  const { stories, themes = [DEFAULT_THEME], ...testStoryParams } = params

  for (const story of stories) {
    for (const theme of themes) {
      testStory({
        ...testStoryParams,
        story,
        theme,
      })
    }
  }
}
