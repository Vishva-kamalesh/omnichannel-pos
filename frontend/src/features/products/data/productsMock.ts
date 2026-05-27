import type {
  Product,
  ProductStatus,
  ProductVariant,
} from '../types/product.types'

export const PRODUCT_CATEGORIES = [
  'Apparel',
  'Footwear',
  'Accessories',
  'Bags',
  'Home & Living',
  'Electronics',
] as const

const CATEGORY_ACCENT: Record<string, string> = {
  Apparel: '#6366f1',
  Footwear: '#0891b2',
  Accessories: '#d97706',
  Bags: '#7c3aed',
  'Home & Living': '#0e9f6e',
  Electronics: '#2563eb',
}

export function getCategoryAccent(category: string): string {
  return CATEGORY_ACCENT[category] ?? '#6b7280'
}

const CATEGORY_PREFIX: Record<string, string> = {
  Apparel: 'APP',
  Footwear: 'FTW',
  Accessories: 'ACC',
  Bags: 'BAG',
  'Home & Living': 'HML',
  Electronics: 'ELC',
}

/** Constrained palette so variant swatches always resolve to a real color. */
export const PRODUCT_COLORS: { name: string; hex: string }[] = [
  { name: 'Black', hex: '#1f2937' },
  { name: 'Charcoal', hex: '#374151' },
  { name: 'Grey', hex: '#9ca3af' },
  { name: 'Silver', hex: '#cbd5e1' },
  { name: 'White', hex: '#f3f4f6' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Indigo', hex: '#4338ca' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Forest', hex: '#15803d' },
  { name: 'Olive', hex: '#4d7c0f' },
  { name: 'Sage', hex: '#84a98c' },
  { name: 'Camel', hex: '#b45309' },
  { name: 'Tan', hex: '#b88a4a' },
  { name: 'Brown', hex: '#78350f' },
  { name: 'Sand', hex: '#d6c7a1' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Gold', hex: '#ca8a04' },
  { name: 'Burgundy', hex: '#881337' },
]

const COLOR_HEX = new Map(PRODUCT_COLORS.map((color) => [color.name, color.hex]))

export function getColorHex(name: string): string {
  return COLOR_HEX.get(name) ?? '#9ca3af'
}

type RawProduct = {
  name: string
  category: string
  price: number
  status: ProductStatus
  sizes: string[]
  colors: string[]
  updatedAt: string
}

const RAW_PRODUCTS: RawProduct[] = [
  // Apparel
  { name: 'Classic Cotton Crew T-Shirt', category: 'Apparel', price: 799, status: 'active', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'], updatedAt: '18 May 2026' },
  { name: 'Slim Fit Denim Jeans', category: 'Apparel', price: 2499, status: 'active', sizes: ['30', '32', '34', '36'], colors: ['Indigo', 'Black'], updatedAt: '15 May 2026' },
  { name: 'Merino Wool Sweater', category: 'Apparel', price: 3299, status: 'active', sizes: ['S', 'M', 'L'], colors: ['Charcoal', 'Camel', 'Forest'], updatedAt: '02 May 2026' },
  { name: 'Oxford Button-Down Shirt', category: 'Apparel', price: 1799, status: 'active', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Sky'], updatedAt: '20 May 2026' },
  { name: 'Performance Zip Hoodie', category: 'Apparel', price: 2199, status: 'draft', sizes: ['S', 'M', 'L', 'XL'], colors: ['Grey', 'Black'], updatedAt: '21 May 2026' },
  { name: 'Linen Summer Dress', category: 'Apparel', price: 2799, status: 'active', sizes: ['XS', 'S', 'M', 'L'], colors: ['Sand', 'White'], updatedAt: '11 May 2026' },
  // Footwear
  { name: 'Everyday Running Shoes', category: 'Footwear', price: 3999, status: 'active', sizes: ['7', '8', '9', '10', '11'], colors: ['Black', 'White', 'Grey'], updatedAt: '19 May 2026' },
  { name: 'Leather Chelsea Boots', category: 'Footwear', price: 5499, status: 'active', sizes: ['8', '9', '10', '11'], colors: ['Brown', 'Black'], updatedAt: '08 May 2026' },
  { name: 'Canvas Low-Top Sneakers', category: 'Footwear', price: 2299, status: 'active', sizes: ['7', '8', '9', '10'], colors: ['White', 'Navy'], updatedAt: '17 May 2026' },
  { name: 'Suede Loafers', category: 'Footwear', price: 4199, status: 'archived', sizes: ['8', '9', '10'], colors: ['Tan', 'Charcoal'], updatedAt: '24 Apr 2026' },
  // Accessories
  { name: 'Genuine Leather Belt', category: 'Accessories', price: 1299, status: 'active', sizes: ['32', '34', '36'], colors: ['Brown', 'Black'], updatedAt: '14 May 2026' },
  { name: 'Wool Blend Beanie', category: 'Accessories', price: 899, status: 'active', sizes: ['One Size'], colors: ['Charcoal', 'Burgundy', 'Forest'], updatedAt: '12 May 2026' },
  { name: 'Polarized Aviator Sunglasses', category: 'Accessories', price: 1899, status: 'active', sizes: ['One Size'], colors: ['Gold', 'Silver'], updatedAt: '21 May 2026' },
  { name: 'Silk Neck Tie', category: 'Accessories', price: 1099, status: 'draft', sizes: ['One Size'], colors: ['Navy', 'Burgundy'], updatedAt: '09 May 2026' },
  { name: 'Stainless Steel Watch', category: 'Accessories', price: 6999, status: 'active', sizes: ['One Size'], colors: ['Silver', 'Black'], updatedAt: '16 May 2026' },
  // Bags
  { name: 'Canvas Commuter Backpack', category: 'Bags', price: 2599, status: 'active', sizes: ['One Size'], colors: ['Olive', 'Black', 'Navy'], updatedAt: '20 May 2026' },
  { name: 'Leather Laptop Sleeve 14"', category: 'Bags', price: 1699, status: 'active', sizes: ['One Size'], colors: ['Tan', 'Black'], updatedAt: '05 May 2026' },
  { name: 'Weekender Duffel Bag', category: 'Bags', price: 3499, status: 'active', sizes: ['One Size'], colors: ['Charcoal', 'Olive'], updatedAt: '13 May 2026' },
  { name: 'Crossbody Sling Bag', category: 'Bags', price: 1499, status: 'archived', sizes: ['One Size'], colors: ['Black', 'Sand'], updatedAt: '30 Apr 2026' },
  // Home & Living
  { name: 'Ceramic Coffee Mug 350ml', category: 'Home & Living', price: 449, status: 'active', sizes: ['One Size'], colors: ['White', 'Charcoal', 'Sage'], updatedAt: '18 May 2026' },
  { name: 'Cotton Bath Towel', category: 'Home & Living', price: 999, status: 'active', sizes: ['S', 'M', 'L'], colors: ['White', 'Grey', 'Navy'], updatedAt: '10 May 2026' },
  { name: 'Scented Soy Candle', category: 'Home & Living', price: 749, status: 'active', sizes: ['One Size'], colors: ['Amber', 'Sage'], updatedAt: '21 May 2026' },
  { name: 'Linen Throw Pillow', category: 'Home & Living', price: 1199, status: 'draft', sizes: ['One Size'], colors: ['Sand', 'Forest', 'Charcoal'], updatedAt: '19 May 2026' },
  // Electronics
  { name: 'Wireless Bluetooth Earbuds', category: 'Electronics', price: 4499, status: 'active', sizes: ['One Size'], colors: ['White', 'Black'], updatedAt: '22 May 2026' },
  { name: 'Fast Charging Power Bank 10000mAh', category: 'Electronics', price: 1999, status: 'active', sizes: ['One Size'], colors: ['Black', 'White'], updatedAt: '17 May 2026' },
  { name: 'USB-C Braided Cable 2m', category: 'Electronics', price: 499, status: 'active', sizes: ['One Size'], colors: ['Black', 'White'], updatedAt: '07 May 2026' },
  { name: 'Bluetooth Speaker Mini', category: 'Electronics', price: 2899, status: 'active', sizes: ['One Size'], colors: ['Charcoal', 'Sky'], updatedAt: '21 May 2026' },
]

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((raw, productIndex) => {
  const id = `prd-${(productIndex + 1).toString().padStart(3, '0')}`
  const variants: ProductVariant[] = []
  let variantIndex = 0

  raw.sizes.forEach((size, sizeIndex) => {
    raw.colors.forEach((color, colorIndex) => {
      variantIndex += 1
      variants.push({
        id: `${id}-v${variantIndex.toString().padStart(2, '0')}`,
        size,
        color,
        // Deterministic spread of stock levels, including some sold-out variants.
        stock: (productIndex * 7 + sizeIndex * 11 + colorIndex * 5) % 38,
      })
    })
  })

  return {
    id,
    name: raw.name,
    sku: `${CATEGORY_PREFIX[raw.category]}-${1000 + productIndex}`,
    category: raw.category,
    price: raw.price,
    status: raw.status,
    variants,
    updatedAt: raw.updatedAt,
  }
})

export function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0)
}

/** Distinct colors across a product's variants, in first-seen order. */
export function getVariantColors(product: Product): string[] {
  const seen = new Set<string>()
  for (const variant of product.variants) seen.add(variant.color)
  return Array.from(seen)
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
