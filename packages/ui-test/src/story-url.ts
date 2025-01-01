const { STORYBOOK_URL } = process.env
if (typeof STORYBOOK_URL !== 'string') {
  throw new Error('missing env variable STORYBOOK_URL')
}

type GetStoryUrlParams = {
  title: string
  story: string
  args?: Record<string, unknown>
}

export const getStoryUrl = (params: GetStoryUrlParams) => {
  const { title, story, args: storyArgs } = params

  const storyUrl = new URL(STORYBOOK_URL)
  storyUrl.pathname = '/iframe.html'
  storyUrl.searchParams.set('id', storyId(title, story))
  storyUrl.searchParams.set('viewMode', 'story')
  storyUrl.searchParams.set('globals', '')

  if (storyArgs) {
    storyUrl.searchParams.set('args', argsToString(storyArgs))
  }

  return storyUrl
}

const camelCaseToKebab = (str: string) => str.replace(/[a-z][A-Z]/g, pair => `${pair[0]}-${pair[1]}`).toLowerCase()

const storyId = (title: string, story: string) =>
  `${title.replace(/\//g, '-').toLowerCase()}--${camelCaseToKebab(story)}`

const flatObject = (obj: Record<string, unknown>) => {
  const flat: Record<string, unknown> = {}

  for (const key in obj) {
    const value = obj[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedFlat = flatObject(value as Record<string, unknown>)
      for (const nestedKey in nestedFlat) {
        flat[`${key}.${nestedKey}`] = nestedFlat[nestedKey]
      }
    } else {
      flat[key] = value
    }
  }

  return flat
}

const argsToString = (args: Record<string, unknown>) => {
  const flatArgs = flatObject(args)

  return Object.entries(flatArgs)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}
