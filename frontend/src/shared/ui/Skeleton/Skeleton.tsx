import type { CSSProperties } from 'react'
import styles from './Skeleton.module.css'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  radius?: string | number
  className?: string
}

const toCss = (v: string | number) => (typeof v === 'number' ? `${v}px` : v)

/** A single shimmer placeholder block. Sizes accept numbers (px) or any CSS length. */
export function Skeleton({
  width = '100%',
  height = 14,
  radius = 'var(--radius-sm)',
  className,
}: SkeletonProps) {
  const style: CSSProperties = {
    width: toCss(width),
    height: toCss(height),
    borderRadius: toCss(radius),
  }
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  )
}
