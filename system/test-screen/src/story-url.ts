type GetStoryUrlParams = {
  title: string
  story: string
}

export const getStoryUrl = (params: GetStoryUrlParams) => {
  const { title, story } = params

  const searchParams = new URLSearchParams([
    ['id', storyId(title, story)],
    ['viewMode', 'story'],
    ['globals', ''],
  ])

  return `/iframe.html?${searchParams}`
}

const camelCaseToKebab = (str: string) => str.replace(/[a-z][A-Z]/g, pair => `${pair[0]}-${pair[1]}`).toLowerCase()

const storyId = (title: string, story: string) =>
  `${title.replace(/\//g, '-').toLowerCase()}--${camelCaseToKebab(story)}`
