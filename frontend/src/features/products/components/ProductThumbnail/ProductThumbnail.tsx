import { getCategoryAccent } from '../../data/productsMock'
import styles from './ProductThumbnail.module.css'

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

type ProductThumbnailProps = {
  name: string
  category: string
}

/** Placeholder product image — initials tinted by category. */
export function ProductThumbnail({ name, category }: ProductThumbnailProps) {
  return (
    <span
      className={styles.thumb}
      style={{ color: getCategoryAccent(category) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}
