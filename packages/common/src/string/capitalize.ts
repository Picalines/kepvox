export const capitalize = (str: string) => (str === '' ? str : `${str[0]?.toUpperCase()}${str.slice(1)}`)
