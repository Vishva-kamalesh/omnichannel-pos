import type { CategoryMeta, Product, ProductCategory } from '../types/pos.types'

/** At or below this on-hand count a product is flagged low stock. */
export const LOW_STOCK_THRESHOLD = 10

export const CATEGORIES: CategoryMeta[] = [
  { id: 'grocery', label: 'Grocery', accent: '#0e9f6e' },
  { id: 'beverages', label: 'Beverages', accent: '#2563eb' },
  { id: 'bakery', label: 'Bakery', accent: '#d97706' },
  { id: 'dairy', label: 'Dairy', accent: '#0891b2' },
  { id: 'snacks', label: 'Snacks', accent: '#db2777' },
  { id: 'personal-care', label: 'Personal Care', accent: '#7c3aed' },
  { id: 'household', label: 'Household', accent: '#475569' },
]

const CATEGORY_BY_ID = new Map(CATEGORIES.map((meta) => [meta.id, meta]))

export function getCategoryMeta(id: ProductCategory): CategoryMeta {
  return CATEGORY_BY_ID.get(id) ?? CATEGORIES[0]
}

const SKU_PREFIX: Record<ProductCategory, string> = {
  grocery: 'GRO',
  beverages: 'BEV',
  bakery: 'BAK',
  dairy: 'DRY',
  snacks: 'SNK',
  'personal-care': 'PCR',
  household: 'HHD',
}

type RawProduct = Omit<Product, 'id' | 'sku' | 'barcode'>

const RAW_PRODUCTS: RawProduct[] = [
  // Grocery
  { name: 'Basmati Rice', price: 620, unit: '5 kg', category: 'grocery', taxRate: 0.05, stock: 48 },
  { name: 'Toor Dal', price: 165, unit: '1 kg', category: 'grocery', taxRate: 0.05, stock: 36 },
  { name: 'Whole Wheat Atta', price: 285, unit: '5 kg', category: 'grocery', taxRate: 0.05, stock: 27 },
  { name: 'Sunflower Cooking Oil', price: 145, unit: '1 L', category: 'grocery', taxRate: 0.05, stock: 52 },
  { name: 'Refined Sugar', price: 48, unit: '1 kg', category: 'grocery', taxRate: 0.05, stock: 64 },
  { name: 'Iodized Salt', price: 24, unit: '1 kg', category: 'grocery', taxRate: 0, stock: 90 },
  { name: 'Turmeric Powder', price: 62, unit: '200 g', category: 'grocery', taxRate: 0.05, stock: 41 },
  { name: 'Premium Tea Leaves', price: 240, unit: '500 g', category: 'grocery', taxRate: 0.05, stock: 19 },
  { name: 'Masoor Dal', price: 132, unit: '1 kg', category: 'grocery', taxRate: 0.05, stock: 22 },
  { name: 'Flattened Rice Poha', price: 38, unit: '500 g', category: 'grocery', taxRate: 0.05, stock: 0 },
  // Beverages
  { name: 'Packaged Drinking Water', price: 20, unit: '1 L', category: 'beverages', taxRate: 0.18, stock: 120 },
  { name: 'Cola Soft Drink', price: 40, unit: '750 ml', category: 'beverages', taxRate: 0.18, stock: 73 },
  { name: 'Orange Juice', price: 110, unit: '1 L', category: 'beverages', taxRate: 0.12, stock: 28 },
  { name: 'Cold Brew Coffee', price: 60, unit: '200 ml', category: 'beverages', taxRate: 0.18, stock: 34 },
  { name: 'Green Tea Bags', price: 150, unit: '25 bags', category: 'beverages', taxRate: 0.05, stock: 17 },
  { name: 'Energy Drink', price: 110, unit: '250 ml', category: 'beverages', taxRate: 0.18, stock: 6 },
  // Bakery
  { name: 'White Sandwich Bread', price: 45, unit: '400 g', category: 'bakery', taxRate: 0.05, stock: 30 },
  { name: 'Multigrain Loaf', price: 58, unit: '450 g', category: 'bakery', taxRate: 0.05, stock: 22 },
  { name: 'Butter Croissant', price: 42, unit: 'each', category: 'bakery', taxRate: 0.18, stock: 16 },
  { name: 'Chocolate Chip Muffin', price: 38, unit: 'each', category: 'bakery', taxRate: 0.18, stock: 12 },
  { name: 'Whole Wheat Buns', price: 35, unit: '6 pack', category: 'bakery', taxRate: 0.05, stock: 0 },
  // Dairy
  { name: 'Toned Milk', price: 56, unit: '1 L', category: 'dairy', taxRate: 0, stock: 80 },
  { name: 'Fresh Paneer', price: 89, unit: '200 g', category: 'dairy', taxRate: 0.05, stock: 24 },
  { name: 'Probiotic Curd', price: 40, unit: '400 g', category: 'dairy', taxRate: 0.05, stock: 38 },
  { name: 'Salted Butter', price: 58, unit: '100 g', category: 'dairy', taxRate: 0.12, stock: 29 },
  { name: 'Cheese Slices', price: 130, unit: '10 slices', category: 'dairy', taxRate: 0.12, stock: 18 },
  { name: 'Greek Yogurt', price: 45, unit: '100 g', category: 'dairy', taxRate: 0.12, stock: 26 },
  // Snacks
  { name: 'Classic Potato Chips', price: 30, unit: '90 g', category: 'snacks', taxRate: 0.12, stock: 95 },
  { name: 'Salted Peanuts', price: 65, unit: '200 g', category: 'snacks', taxRate: 0.12, stock: 44 },
  { name: 'Dark Chocolate Bar', price: 150, unit: '100 g', category: 'snacks', taxRate: 0.18, stock: 31 },
  { name: 'Digestive Biscuits', price: 45, unit: '250 g', category: 'snacks', taxRate: 0.18, stock: 58 },
  { name: 'Trail Mix', price: 180, unit: '150 g', category: 'snacks', taxRate: 0.12, stock: 14 },
  { name: 'Instant Noodles', price: 56, unit: '4 pack', category: 'snacks', taxRate: 0.18, stock: 67 },
  // Personal Care
  { name: 'Herbal Toothpaste', price: 95, unit: '150 g', category: 'personal-care', taxRate: 0.18, stock: 49 },
  { name: 'Anti-Dandruff Shampoo', price: 245, unit: '340 ml', category: 'personal-care', taxRate: 0.18, stock: 21 },
  { name: 'Moisturizing Soap', price: 140, unit: '4 pack', category: 'personal-care', taxRate: 0.18, stock: 53 },
  { name: 'Hand Wash Refill', price: 99, unit: '750 ml', category: 'personal-care', taxRate: 0.18, stock: 33 },
  { name: 'Daily Face Wash', price: 185, unit: '100 g', category: 'personal-care', taxRate: 0.18, stock: 7 },
  // Household
  { name: 'Dishwash Gel', price: 165, unit: '750 ml', category: 'household', taxRate: 0.18, stock: 40 },
  { name: 'Laundry Detergent', price: 210, unit: '1 kg', category: 'household', taxRate: 0.18, stock: 36 },
  { name: 'Floor Cleaner', price: 185, unit: '1 L', category: 'household', taxRate: 0.18, stock: 25 },
  { name: 'Garbage Bags', price: 120, unit: '30 bags', category: 'household', taxRate: 0.18, stock: 48 },
  { name: 'Paper Towels', price: 95, unit: '2 rolls', category: 'household', taxRate: 0.18, stock: 9 },
  { name: 'Aluminium Foil', price: 160, unit: '72 m', category: 'household', taxRate: 0.18, stock: 22 },
]

export const POS_PRODUCTS: Product[] = RAW_PRODUCTS.map((raw, index) => ({
  ...raw,
  id: `p-${(index + 1).toString().padStart(3, '0')}`,
  sku: `${SKU_PREFIX[raw.category]}-${1001 + index}`,
  barcode: (8901000000000 + index * 4271).toString(),
}))

/** Resolve a scanned/typed code against barcode or SKU. */
export function findProductByCode(rawCode: string): Product | undefined {
  const code = rawCode.trim().toLowerCase()
  if (!code) return undefined
  return POS_PRODUCTS.find(
    (product) =>
      product.barcode === code || product.sku.toLowerCase() === code,
  )
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
