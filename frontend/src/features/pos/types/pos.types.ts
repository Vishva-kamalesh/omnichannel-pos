export type ProductCategory =
  | 'grocery'
  | 'beverages'
  | 'bakery'
  | 'dairy'
  | 'snacks'
  | 'personal-care'
  | 'household'

export type Product = {
  id: string
  name: string
  sku: string
  barcode: string
  price: number
  unit: string
  category: ProductCategory
  /** GST rate as a fraction, e.g. 0.05 for 5%. */
  taxRate: number
  stock: number
}

export type CategoryMeta = {
  id: ProductCategory
  label: string
  /** Hex accent used for the catalog swatch. */
  accent: string
}

export type PaymentMethodId = 'cash' | 'card' | 'upi' | 'wallet'
