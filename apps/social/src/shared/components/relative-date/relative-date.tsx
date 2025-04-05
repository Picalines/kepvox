'use client'

import { Skeleton } from '@repo/ui-kit/components/skeleton'
import { Text } from '@repo/ui-kit/components/text'
import { formatDistance } from 'date-fns/formatDistance'
import { type FC, useEffect, useState } from 'react'

type Props = {
  date: Date
  suffix?: boolean
}

export const RelativeDate: FC<Props> = props => {
  const { date, suffix } = props

  const [formatted, setFormatted] = useState<string | null>(null)

  useEffect(() => {
    setFormatted(formatDistance(date, new Date(), { addSuffix: suffix }))
  }, [date, suffix])

  return formatted ? (
    <Text title={date.toLocaleString()}>{formatted}</Text>
  ) : (
    <Skeleton className="inline-block h-[1ch] w-[5ch]" />
  )
}
