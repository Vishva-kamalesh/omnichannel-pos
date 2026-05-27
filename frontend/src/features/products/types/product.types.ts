export type ProductStatus = 'active' | 'draft' | 'archived'

export type ProductVariant = {
  id: string
  /** Size label — e.g. "M", "42", or "One Size". */
  size: string
  /** Color name resolved against the shared product palette. */
  color: string
  stock: number
}

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  /** Selling price in INR. */
  price: number
  status: ProductStatus
  variants: ProductVariant[]
  /** Human-readable last-updated date, e.g. "18 May 2026". */
  updatedAt: string
}
