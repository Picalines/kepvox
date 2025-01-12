export const binarySearchFirst = <T>(array: readonly T[], compare: (element: T) => number): number | null => {
  let start = 0
  let end = array.length - 1
  let result: number | null = null

  while (start <= end) {
    const middle = Math.floor((start + end) / 2)
    const compareResult = compare(array[middle] as T)

    if (compareResult === 0) {
      result = middle
    }

    if (compareResult >= 0) {
      end = middle - 1
    } else {
      start = middle + 1
    }
  }

  return result
}

export const binarySearchLast = <T>(array: readonly T[], compare: (element: T) => number): number | null => {
  let start = 0
  let end = array.length - 1
  let result: number | null = null

  while (start <= end) {
    const middle = Math.floor((start + end) / 2)
    const compareResult = compare(array[middle] as T)

    if (compareResult === 0) {
      result = middle
    }

    if (compareResult > 0) {
      end = middle - 1
    } else {
      start = middle + 1
    }
  }

  return result
}
