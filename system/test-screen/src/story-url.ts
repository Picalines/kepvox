const { PLAYWRIGHT_PORT } = process.env
if (!PLAYWRIGHT_PORT) {
  throw new Error('missing env variable PLAYWRIGHT_PORT')
}

type GetStoryUrlParams = {
  title: string
  story: string
}

export const getStoryUrl = (params: GetStoryUrlParams) => {
  const { title, story } = params

  const storyUrl = new URL('http://127.0.0.1')
  storyUrl.port = PLAYWRIGHT_PORT
  storyUrl.pathname = '/iframe.html'
  storyUrl.searchParams.set('id', storyId(title, story))
  storyUrl.searchParams.set('viewMode', 'story')
  storyUrl.searchParams.set('globals', '')

  return storyUrl
}

const camelCaseToKebab = (str: string) => str.replace(/[a-z][A-Z]/g, pair => `${pair[0]}-${pair[1]}`).toLowerCase()

const storyId = (title: string, story: string) =>
  `${title.replace(/\//g, '-').toLowerCase()}--${camelCaseToKebab(story)}`
