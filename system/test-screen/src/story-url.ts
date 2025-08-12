type GetStoryUrlParams = {
  title: string
  story: string
  theme: string
}

export const getStoryUrl = (params: GetStoryUrlParams) => {
  const { title, story, theme } = params

  const searchParams = new URLSearchParams([
    ['id', storyId(title, story)],
    ['viewMode', 'story'],
    ['globals', `theme:${theme}`],
  ])

  return `/iframe.html?${searchParams}`
}

const camelCaseToKebab = (str: string) => str.replace(/[a-z][A-Z]/g, pair => `${pair[0]}-${pair[1]}`).toLowerCase()

const storyId = (title: string, story: string) =>
  `${title.replace(/\//g, '-').toLowerCase()}--${camelCaseToKebab(story)}`
