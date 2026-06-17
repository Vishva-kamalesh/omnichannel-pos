/**
 * Deterministic placeholder-image helpers.
 *
 * These return URLs to free placeholder CDNs (no asset files in the repo), so
 * the same seed always yields the same picture. They require network access at
 * runtime; if a request fails, callers fall back to initials / a gradient.
 */

/** A seeded product/catalog photo from picsum.photos. */
export function productImage(seed: string, width = 400, height = 300): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

/** A generic seeded photo (banners, tiles) from picsum.photos. */
export function photo(seed: string, width = 800, height = 400): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

/** A seeded avatar face from pravatar.cc. */
export function avatarImage(seed: string, size = 80): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`
}

/**
 * No-initials fallback avatar — a deterministic illustrated character from
 * DiceBear. Used when the photo avatar fails to load, so every user always
 * shows a picture rather than a letter chip.
 */
export function avatarFallback(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundType=gradientLinear&radius=50`
}
