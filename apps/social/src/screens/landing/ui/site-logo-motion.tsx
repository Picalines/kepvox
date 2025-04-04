import { type Variants, motion } from 'motion/react'
import type { FC } from 'react'

const variants = {
  hidden: { pathLength: 0, strokeWidth: 0, scale: 0.9 },
  shown: { pathLength: 1, strokeWidth: 24, scale: 1 },
} satisfies Variants

type Props = {
  width: number
  height: number
}

export const SiteLogoMotion: FC<Props> = props => {
  return (
    <motion.svg role="graphics-symbol" viewBox="0 0 200 200" fill="none" overflow="visible" {...props}>
      <motion.path
        d="M31.8741 103.495C27.0412 104.787 22.6669 107.404 19.2459 111.05C15.8249 114.696 13.4938 119.226 12.5165 124.126C11.5391 129.027 11.9544 134.103 13.7155 138.78C15.4765 143.457 18.513 147.548 22.4813 150.591C26.4497 153.634 31.1915 155.507 36.1702 155.998C41.149 156.489 46.1661 155.579 50.6537 153.37C55.1414 151.161 58.9205 147.742 61.5636 143.5C64.2066 139.257 65.6081 134.36 65.6095 129.363L65.6023 12L163 38.3255V155.228C163 160.225 161.6 165.122 158.958 169.366C156.316 173.609 152.538 177.029 148.051 179.239C143.564 181.449 138.547 182.361 133.568 181.871C128.589 181.381 123.847 179.51 119.878 176.468C115.909 173.426 112.871 169.335 111.109 164.659C109.347 159.982 108.93 154.906 109.906 150.005C110.882 145.105 113.212 140.574 116.632 136.927C120.052 133.28 124.425 130.662 129.258 129.369"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={variants}
        initial="hidden"
        animate="shown"
      />
      <motion.path
        d="M65.6023 58.4042L163 84.7296"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={variants}
        initial="hidden"
        animate="shown"
      />
    </motion.svg>
  )
}
