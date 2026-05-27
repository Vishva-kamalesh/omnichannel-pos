import { AlertTriangle, Boxes, IndianRupee, PackageSearch } from 'lucide-react'
import type {
  InventoryItem,
  InventorySummaryMetric,
  StockLocation,
  StockStatus,
} from '../types/inventory.types'

export const STOCK_LOCATIONS: StockLocation[] = [
  { id: 'loc-dtf', code: 'DTF', name: 'Downtown Flagship', type: 'store' },
  { id: 'loc-mal', code: 'MAL', name: 'Mall Outlet', type: 'store' },
  { id: 'loc-apk', code: 'APK', name: 'Airport Kiosk', type: 'store' },
  { id: 'loc-cwh', code: 'CWH', name: 'Central Warehouse', type: 'warehouse' },
  {
    id: 'loc-wdc',
    code: 'WDC',
    name: 'West Distribution Center',
    type: 'warehouse',
  },
]

const LOCATION_BY_ID = new Map(STOCK_LOCATIONS.map((loc) => [loc.id, loc]))

export function getLocation(id: string): StockLocation {
  return LOCATION_BY_ID.get(id) ?? STOCK_LOCATIONS[0]
}

export const INVENTORY_CATEGORIES = [
  'Bakery',
  'Beverages',
  'Dairy',
  'Frozen',
  'Grocery',
  'Household',
  'Personal Care',
  'Snacks',
] as const

const SKU_PREFIX: Record<string, string> = {
  Bakery: 'BAK',
  Beverages: 'BEV',
  Dairy: 'DRY',
  Frozen: 'FRZ',
  Grocery: 'GRO',
  Household: 'HHD',
  'Personal Care': 'PCR',
  Snacks: 'SNK',
}

type RawItem = Omit<InventoryItem, 'id' | 'sku'>

const RAW_ITEMS: RawItem[] = [
  { name: 'Tata Salt Iodized 1kg', category: 'Grocery', locationId: 'loc-dtf', onHand: 142, committed: 18, reorderPoint: 40, unitCost: 22, updatedAt: '2h ago' },
  { name: 'Aashirvaad Whole Wheat Atta 5kg', category: 'Grocery', locationId: 'loc-cwh', onHand: 860, committed: 120, reorderPoint: 200, unitCost: 265, updatedAt: '4h ago' },
  { name: 'Fortune Sunflower Oil 1L', category: 'Grocery', locationId: 'loc-mal', onHand: 64, committed: 12, reorderPoint: 30, unitCost: 135, updatedAt: '1h ago' },
  { name: 'Amul Gold Full Cream Milk 1L', category: 'Dairy', locationId: 'loc-dtf', onHand: 0, committed: 0, reorderPoint: 50, unitCost: 33, updatedAt: '25 min ago' },
  { name: 'Amul Butter 100g', category: 'Dairy', locationId: 'loc-dtf', onHand: 38, committed: 9, reorderPoint: 25, unitCost: 54, updatedAt: '1h ago' },
  { name: 'Britannia Cheese Slices 200g', category: 'Dairy', locationId: 'loc-mal', onHand: 22, committed: 14, reorderPoint: 20, unitCost: 118, updatedAt: '6h ago' },
  { name: 'Mother Dairy Probiotic Curd 400g', category: 'Dairy', locationId: 'loc-apk', onHand: 31, committed: 4, reorderPoint: 15, unitCost: 36, updatedAt: '8 min ago' },
  { name: 'Nestlé Everyday Dairy Whitener 1kg', category: 'Dairy', locationId: 'loc-wdc', onHand: 420, committed: 60, reorderPoint: 150, unitCost: 175, updatedAt: 'Yesterday' },
  { name: 'Coca-Cola Soft Drink 750ml', category: 'Beverages', locationId: 'loc-dtf', onHand: 96, committed: 22, reorderPoint: 48, unitCost: 28, updatedAt: '2h ago' },
  { name: 'Pepsi Soft Drink 1.25L', category: 'Beverages', locationId: 'loc-mal', onHand: 12, committed: 3, reorderPoint: 24, unitCost: 55, updatedAt: '4h ago' },
  { name: 'Real Mixed Fruit Juice 1L', category: 'Beverages', locationId: 'loc-apk', onHand: 0, committed: 0, reorderPoint: 18, unitCost: 92, updatedAt: '3d ago' },
  { name: 'Bisleri Packaged Water 1L', category: 'Beverages', locationId: 'loc-cwh', onHand: 1240, committed: 210, reorderPoint: 400, unitCost: 11, updatedAt: '1h ago' },
  { name: 'Red Bull Energy Drink 250ml', category: 'Beverages', locationId: 'loc-apk', onHand: 27, committed: 6, reorderPoint: 20, unitCost: 108, updatedAt: 'Yesterday' },
  { name: 'Nescafé Classic Coffee 50g', category: 'Beverages', locationId: 'loc-dtf', onHand: 54, committed: 8, reorderPoint: 30, unitCost: 168, updatedAt: '5d ago' },
  { name: "Lay's Classic Salted Chips 90g", category: 'Snacks', locationId: 'loc-dtf', onHand: 88, committed: 19, reorderPoint: 40, unitCost: 18, updatedAt: '2h ago' },
  { name: 'Kurkure Masala Munch 90g', category: 'Snacks', locationId: 'loc-mal', onHand: 9, committed: 2, reorderPoint: 35, unitCost: 17, updatedAt: '6h ago' },
  { name: "Haldiram's Aloo Bhujia 200g", category: 'Snacks', locationId: 'loc-apk', onHand: 41, committed: 7, reorderPoint: 20, unitCost: 52, updatedAt: '1h ago' },
  { name: 'Cadbury Dairy Milk 50g', category: 'Snacks', locationId: 'loc-dtf', onHand: 130, committed: 28, reorderPoint: 50, unitCost: 38, updatedAt: '25 min ago' },
  { name: 'Parle-G Glucose Biscuits 800g', category: 'Snacks', locationId: 'loc-cwh', onHand: 980, committed: 140, reorderPoint: 300, unitCost: 78, updatedAt: '4h ago' },
  { name: 'Oreo Chocolate Biscuits 120g', category: 'Snacks', locationId: 'loc-mal', onHand: 0, committed: 0, reorderPoint: 25, unitCost: 33, updatedAt: '2d ago' },
  { name: 'Maggi 2-Minute Noodles 4-pack', category: 'Grocery', locationId: 'loc-dtf', onHand: 73, committed: 16, reorderPoint: 40, unitCost: 56, updatedAt: '1h ago' },
  { name: 'Kissan Mixed Fruit Jam 200g', category: 'Grocery', locationId: 'loc-mal', onHand: 19, committed: 5, reorderPoint: 18, unitCost: 78, updatedAt: '6h ago' },
  { name: 'Tata Tea Gold 500g', category: 'Grocery', locationId: 'loc-apk', onHand: 36, committed: 6, reorderPoint: 20, unitCost: 245, updatedAt: '2h ago' },
  { name: 'Saffola Gold Edible Oil 1L', category: 'Grocery', locationId: 'loc-cwh', onHand: 540, committed: 80, reorderPoint: 200, unitCost: 165, updatedAt: 'Yesterday' },
  { name: 'MDH Garam Masala 100g', category: 'Grocery', locationId: 'loc-dtf', onHand: 44, committed: 9, reorderPoint: 25, unitCost: 72, updatedAt: '3d ago' },
  { name: 'Daawat Basmati Rice 5kg', category: 'Grocery', locationId: 'loc-wdc', onHand: 320, committed: 90, reorderPoint: 150, unitCost: 595, updatedAt: '4h ago' },
  { name: 'Modern Sandwich Bread 400g', category: 'Bakery', locationId: 'loc-dtf', onHand: 28, committed: 8, reorderPoint: 24, unitCost: 42, updatedAt: '8 min ago' },
  { name: 'Britannia Brown Bread 400g', category: 'Bakery', locationId: 'loc-mal', onHand: 0, committed: 0, reorderPoint: 20, unitCost: 48, updatedAt: 'Yesterday' },
  { name: 'Theobroma Butter Croissant 6-pack', category: 'Bakery', locationId: 'loc-apk', onHand: 16, committed: 3, reorderPoint: 12, unitCost: 110, updatedAt: '1h ago' },
  { name: 'Chocolate Chip Muffin 4-pack', category: 'Bakery', locationId: 'loc-dtf', onHand: 22, committed: 5, reorderPoint: 15, unitCost: 95, updatedAt: '2h ago' },
  { name: 'Colgate MaxFresh Toothpaste 150g', category: 'Personal Care', locationId: 'loc-dtf', onHand: 67, committed: 11, reorderPoint: 30, unitCost: 89, updatedAt: '5d ago' },
  { name: 'Dove Beauty Bar Soap 4x100g', category: 'Personal Care', locationId: 'loc-mal', onHand: 14, committed: 4, reorderPoint: 20, unitCost: 196, updatedAt: '6h ago' },
  { name: 'Head & Shoulders Shampoo 340ml', category: 'Personal Care', locationId: 'loc-apk', onHand: 38, committed: 7, reorderPoint: 18, unitCost: 285, updatedAt: '1h ago' },
  { name: 'Gillette Mach3 Cartridges 8-pack', category: 'Personal Care', locationId: 'loc-wdc', onHand: 210, committed: 35, reorderPoint: 80, unitCost: 320, updatedAt: 'Yesterday' },
  { name: 'Nivea Body Lotion 400ml', category: 'Personal Care', locationId: 'loc-mal', onHand: 23, committed: 9, reorderPoint: 22, unitCost: 245, updatedAt: '2h ago' },
  { name: 'Surf Excel Matic Detergent 1kg', category: 'Household', locationId: 'loc-dtf', onHand: 81, committed: 17, reorderPoint: 40, unitCost: 128, updatedAt: '4h ago' },
  { name: 'Vim Dishwash Gel 750ml', category: 'Household', locationId: 'loc-mal', onHand: 33, committed: 6, reorderPoint: 20, unitCost: 99, updatedAt: '1h ago' },
  { name: 'Harpic Toilet Cleaner 1L', category: 'Household', locationId: 'loc-apk', onHand: 7, committed: 1, reorderPoint: 16, unitCost: 92, updatedAt: '3d ago' },
  { name: 'Lizol Floor Cleaner 975ml', category: 'Household', locationId: 'loc-cwh', onHand: 460, committed: 70, reorderPoint: 180, unitCost: 175, updatedAt: '6h ago' },
  { name: 'Good Knight Mosquito Refill 2-pack', category: 'Household', locationId: 'loc-wdc', onHand: 290, committed: 55, reorderPoint: 120, unitCost: 78, updatedAt: 'Yesterday' },
  { name: 'McCain French Fries 750g', category: 'Frozen', locationId: 'loc-dtf', onHand: 26, committed: 11, reorderPoint: 20, unitCost: 145, updatedAt: '2h ago' },
  { name: 'Safal Frozen Green Peas 500g', category: 'Frozen', locationId: 'loc-mal', onHand: 48, committed: 8, reorderPoint: 25, unitCost: 88, updatedAt: '1h ago' },
  { name: 'Prasuma Chicken Nuggets 400g', category: 'Frozen', locationId: 'loc-apk', onHand: 0, committed: 0, reorderPoint: 18, unitCost: 210, updatedAt: '2d ago' },
  { name: 'Amul Vanilla Ice Cream 1L', category: 'Frozen', locationId: 'loc-wdc', onHand: 180, committed: 40, reorderPoint: 90, unitCost: 245, updatedAt: '4h ago' },
  { name: 'Mother Dairy Fresh Paneer 200g', category: 'Dairy', locationId: 'loc-mal', onHand: 34, committed: 12, reorderPoint: 24, unitCost: 92, updatedAt: '25 min ago' },
  { name: 'Tropicana Orange Juice 1L', category: 'Beverages', locationId: 'loc-dtf', onHand: 41, committed: 7, reorderPoint: 24, unitCost: 115, updatedAt: '1h ago' },
  { name: 'Sunfeast Dark Fantasy Choco Fills', category: 'Snacks', locationId: 'loc-apk', onHand: 58, committed: 13, reorderPoint: 30, unitCost: 45, updatedAt: '6h ago' },
  { name: 'Patanjali Pure Honey 500g', category: 'Grocery', locationId: 'loc-mal', onHand: 11, committed: 2, reorderPoint: 16, unitCost: 165, updatedAt: 'Yesterday' },
]

export const INVENTORY_ITEMS: InventoryItem[] = RAW_ITEMS.map((raw, index) => ({
  ...raw,
  id: `inv-${(index + 1).toString().padStart(3, '0')}`,
  sku: `${SKU_PREFIX[raw.category]}-${2140 + index * 7}`,
}))

/** Sellable units: on-hand minus what is already committed to orders. */
export function getAvailable(item: InventoryItem): number {
  return item.onHand - item.committed
}

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.onHand === 0) return 'out-of-stock'
  if (getAvailable(item) <= item.reorderPoint) return 'low-stock'
  return 'in-stock'
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

/** Condenses large valuations into lakh/crore units for summary cards. */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return formatINR(amount)
}

export function getInventorySummary(
  items: InventoryItem[],
): InventorySummaryMetric[] {
  const totalUnits = items.reduce((sum, item) => sum + item.onHand, 0)
  const totalValue = items.reduce(
    (sum, item) => sum + item.onHand * item.unitCost,
    0,
  )

  let lowCount = 0
  let outCount = 0
  for (const item of items) {
    const status = getStockStatus(item)
    if (status === 'low-stock') lowCount += 1
    else if (status === 'out-of-stock') outCount += 1
  }

  return [
    {
      id: 'skus',
      label: 'Tracked SKUs',
      value: items.length.toString(),
      hint: `${STOCK_LOCATIONS.length} stocking locations`,
      icon: PackageSearch,
    },
    {
      id: 'units',
      label: 'Units on hand',
      value: totalUnits.toLocaleString('en-IN'),
      hint: 'Across all locations',
      icon: Boxes,
    },
    {
      id: 'value',
      label: 'Inventory value',
      value: formatCompactINR(totalValue),
      hint: 'Valued at unit cost',
      icon: IndianRupee,
    },
    {
      id: 'attention',
      label: 'Needs attention',
      value: (lowCount + outCount).toString(),
      hint: `${outCount} out of stock · ${lowCount} running low`,
      icon: AlertTriangle,
      tone: 'warning',
    },
  ]
}
