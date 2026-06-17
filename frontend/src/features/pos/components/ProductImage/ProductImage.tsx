import { useState } from 'react'
import type { CSSProperties } from 'react'
import { getCategoryMeta, getProductImage } from '../../data/posMock'
import type { Product } from '../../types/pos.types'
import styles from './ProductImage.module.css'

/** Stable numeric seed from the name so a generated image never reshuffles. */
function hashSeed(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash % 100000
}

/**
 * Pollinations generates an image straight from the product name, so it is
 * unique per product and matches the item — no shared category placeholder.
 */
function generatedUrl(name: string): string {
  const prompt = `${name}, single product packshot, white background, studio lighting, photorealistic`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=400&height=300&nologo=true&seed=${hashSeed(name)}`
}

/** Up to two initials from the product name for the always-present fallback. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

type Stage = 'curated' | 'generated' | 'done'

type ProductImageProps = {
  product: Product
  className?: string
}

/**
 * Real, per-product image with a guaranteed fallback. A category-tinted
 * initials tile is ALWAYS rendered underneath, so a card is never blank while
 * the photo loads or if every network source fails (which is what left the
 * first tiles empty). Source chain on top of it:
 *   1. exact curated photo for this product, if mapped
 *   2. image generated from THIS product's name (unique per name)
 *   3. nothing — the initials tile shows through
 */
export function ProductImage({ product, className }: ProductImageProps) {
  const curated = getProductImage(product)
  const [stage, setStage] = useState<Stage>(curated ? 'curated' : 'generated')
  const [loaded, setLoaded] = useState(false)

  const wrapClass = [styles.wrap, className].filter(Boolean).join(' ')
  const accent = getCategoryMeta(product.category).accent
  const fallbackStyle = { '--accent': accent } as CSSProperties

  const src =
    stage === 'curated'
      ? curated
      : stage === 'generated'
        ? generatedUrl(product.name)
        : null

  return (
    <span className={wrapClass} aria-hidden="true">
      <span className={styles.fallback} style={fallbackStyle}>
        {initials(product.name)}
      </span>
      {src ? (
        <img
          // Remount on stage change so the browser refetches the new source.
          key={stage}
          className={styles.img}
          src={src}
          alt=""
          loading="lazy"
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setStage((s) => (s === 'curated' ? 'generated' : 'done'))
          }}
        />
      ) : null}
    </span>
  )
}
