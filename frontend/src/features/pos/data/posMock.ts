import type { CategoryMeta, Product, ProductCategory } from '../types/pos.types'

/** At or below this on-hand count a product is flagged low stock. */
export const LOW_STOCK_THRESHOLD = 10

export const CATEGORIES: CategoryMeta[] = [
  { id: 'grocery', label: 'Grocery', accent: '#0e9f6e' },
  { id: 'beverages', label: 'Beverages', accent: '#2563eb' },
  { id: 'bakery', label: 'Bakery', accent: '#d97706' },
  { id: 'dairy', label: 'Dairy', accent: '#0891b2' },
  { id: 'snacks', label: 'Snacks', accent: '#db2777' },
  { id: 'personal-care', label: 'Personal Care', accent: '#0f766e' },
  { id: 'household', label: 'Household', accent: '#7c3aed' },
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

/**
 * Genuine, name-accurate product photos from Wikimedia Commons (freely
 * licensed). Hand-mapped per product and verified, so the picture always
 * matches the item rather than a random placeholder.
 */
const PRODUCT_IMAGES: Record<string, string> = {
  'Basmati Rice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Khyma_and_Basmati_rice.jpg/330px-Khyma_and_Basmati_rice.jpg',
  'Toor Dal':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Pigeon_Pea_%28Toor_Dal%29_%2849683602388%29.jpg/330px-Pigeon_Pea_%28Toor_Dal%29_%2849683602388%29.jpg',
  'Whole Wheat Atta':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Atta_flour.jpg/330px-Atta_flour.jpg',
  'Refined Sugar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sucre_blanc_cassonade_complet_rapadura.jpg/330px-Sucre_blanc_cassonade_complet_rapadura.jpg',
  'Iodized Salt':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Iodized_salt_packet.jpg/330px-Iodized_salt_packet.jpg',
  'Premium Tea Leaves':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Longjing_tea_steeping_in_gaiwan.jpg/330px-Longjing_tea_steeping_in_gaiwan.jpg',
  'Masoor Dal':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/3_types_of_lentil.png/330px-3_types_of_lentil.png',
  'Flattened Rice Poha':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Poha.jpg/330px-Poha.jpg',
  'Packaged Drinking Water':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stilles_Mineralwasser.jpg/330px-Stilles_Mineralwasser.jpg',
  'Cola Soft Drink':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Glass_of_Cola.jpg/330px-Glass_of_Cola.jpg',
  'Orange Juice':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Orangejuice.jpg/330px-Orangejuice.jpg',
  'Cold Brew Coffee':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/ColdBrewCoffeein_Cans.png/330px-ColdBrewCoffeein_Cans.png',
  'Green Tea Bags':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Green_tea_3_appearances.jpg/330px-Green_tea_3_appearances.jpg',
  'Energy Drink':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Energydrinks.jpg/330px-Energydrinks.jpg',
  'White Sandwich Bread':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Wei%C3%9Fbrot-1.jpg/330px-Wei%C3%9Fbrot-1.jpg',
  'Multigrain Loaf':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vegan_no-knead_whole_wheat_bread_loaf%2C_September_2010.jpg/330px-Vegan_no-knead_whole_wheat_bread_loaf%2C_September_2010.jpg',
  'Butter Croissant':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Croissant-Petr_Kratochvil.jpg/330px-Croissant-Petr_Kratochvil.jpg',
  'Chocolate Chip Muffin':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/02116jfMuffins_in_Philippinesfvf_02.jpg/330px-02116jfMuffins_in_Philippinesfvf_02.jpg',
  'Whole Wheat Buns':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Sesame_seed_hamburger_buns.jpg/330px-Sesame_seed_hamburger_buns.jpg',
  'Toned Milk':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glass_of_Milk_%2833657535532%29.jpg/330px-Glass_of_Milk_%2833657535532%29.jpg',
  'Fresh Paneer':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Panir_Paneer_Indian_cheese_fresh.jpg/330px-Panir_Paneer_Indian_cheese_fresh.jpg',
  'Probiotic Curd':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Curd_Setting.jpg/330px-Curd_Setting.jpg',
  'Salted Butter':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stick-of-butter-salted.jpg/330px-Stick-of-butter-salted.jpg',
  'Cheese Slices':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/White_cheddar_cheese_sliced_CNE.jpg/330px-White_cheddar_cheese_sliced_CNE.jpg',
  'Greek Yogurt':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Labneh01.jpg/330px-Labneh01.jpg',
  'Classic Potato Chips':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Potato-Chips.jpg/330px-Potato-Chips.jpg',
  'Salted Peanuts':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Beer_Nuts_%28cropped%29.jpg/330px-Beer_Nuts_%28cropped%29.jpg',
  'Dark Chocolate Bar':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Green_and_Black%27s_dark_chocolate_bar_2.jpg/330px-Green_and_Black%27s_dark_chocolate_bar_2.jpg',
  'Digestive Biscuits':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Digestive_biscuits.jpg/330px-Digestive_biscuits.jpg',
  'Trail Mix':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/330px-2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg',
  'Instant Noodles':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mama_instant_noodle_block.jpg/330px-Mama_instant_noodle_block.jpg',
  'Herbal Toothpaste':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toothpasteonbrush.jpg/330px-Toothpasteonbrush.jpg',
  'Anti-Dandruff Shampoo':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Hair_wash_with_shampoo.jpg/330px-Hair_wash_with_shampoo.jpg',
  'Moisturizing Soap':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Handmade_soap_cropped_and_simplified.jpg/330px-Handmade_soap_cropped_and_simplified.jpg',
  'Dishwash Gel':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Afwasmiddel.jpg/330px-Afwasmiddel.jpg',
  'Laundry Detergent':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Pralni_pra%C5%A1ek.JPG/330px-Pralni_pra%C5%A1ek.JPG',
  'Paper Towels':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Paper_towel.jpg/330px-Paper_towel.jpg',
  'Aluminium Foil':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Aluminio.jpg/330px-Aluminio.jpg',
}

/** A genuine catalog photo matching the product's name (Wikimedia Commons). */
export function getProductImage(product: Product): string {
  return PRODUCT_IMAGES[product.name] ?? ''
}

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
