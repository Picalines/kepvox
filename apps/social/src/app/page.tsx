'use server'

import { buttonVariants } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'

const HomePage: FC = async () => {
  return (
    <div className="flex gap-2">
      <Link href="/sign-in" prefetch={false} className={buttonVariants()}>
        Sign in
      </Link>
      <Link href="/account" prefetch={false} className={buttonVariants()}>
        Account
      </Link>
    </div>
  )
}

export default HomePage
