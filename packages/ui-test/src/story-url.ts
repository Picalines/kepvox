const { STORYBOOK_URL } = process.env
if (typeof STORYBOOK_URL !== 'string') {
  throw new Error('missing env variable STORYBOOK_URL')
}

type GetStoryUrlParams = {
  title: string
  story: string
}

export const getStoryUrl = (params: GetStoryUrlParams) => {
  const { title, story } = params

  const storyUrl = new URL(STORYBOOK_URL)
  storyUrl.pathname = '/iframe.html'
  storyUrl.searchParams.set('id', storyId(title, story))
  storyUrl.searchParams.set('viewMode', 'story')
  storyUrl.searchParams.set('globals', '')

  return storyUrl
}

const camelCaseToKebab = (str: string) => str.replace(/[a-z][A-Z]/g, pair => `${pair[0]}-${pair[1]}`).toLowerCase()

const storyId = (title: string, story: string) =>
  `${title.replace(/\//g, '-').toLowerCase()}--${camelCaseToKebab(story)}`
