'use client'

import { cn } from '@repo/ui-kit/classnames'
import { type Variants, motion } from 'motion/react'
import type { FC } from 'react'
import { SiteLogoMotion } from './site-logo-motion'

const PROJECT_NAME = 'kepvox'

const characterVariants = {
  hidden: { opacity: 0, y: -2 },
  shown: { opacity: 1, y: 0 },
} satisfies Variants

type Props = {
  className?: string
}

export const LandingLogo: FC<Props> = props => {
  const { className } = props

  return (
    <motion.div className={cn('flex scale-500 flex-row items-center space-x-0.5', className)}>
      <SiteLogoMotion width={24} height={24} />
      <motion.span
        className="font-bold text-lg"
        variants={characterVariants}
        initial="hidden"
        animate="shown"
        transition={{ staggerChildren: 0.05 }}
        aria-label={PROJECT_NAME}
      >
        {[...PROJECT_NAME].map((char, index) => (
          <motion.span key={String(index)} variants={characterVariants} className="inline-block" aria-hidden>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </motion.div>
  )
}
