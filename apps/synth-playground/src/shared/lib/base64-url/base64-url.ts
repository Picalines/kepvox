export const encode = (str: string) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(Number(`0x${p1}`))))
}

export const decode = (str: string) => {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(''),
  )
}
