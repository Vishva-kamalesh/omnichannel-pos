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

/** A store the terminal can ring sales against (used by the header picker). */
export type StoreOption = {
  id: string
  name: string
  location: string
}

export type PaymentMethodId = 'cash' | 'card' | 'upi' | 'wallet'

/** Outcome of resolving a scanned or typed code at the terminal. */
export type ScanResult =
  | { status: 'added'; product: Product }
  | { status: 'out-of-stock'; product: Product }
  | { status: 'not-found' }
