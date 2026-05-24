import type { LucideIcon } from 'lucide-react'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type LocationType = 'store' | 'warehouse'

export type StockLocation = {
  id: string
  /** Short location code shown in the table, e.g. "DTF". */
  code: string
  name: string
  type: LocationType
}

export type InventoryItem = {
  id: string
  sku: string
  name: string
  category: string
  locationId: string
  /** Physical units currently in the location. */
  onHand: number
  /** Units reserved against open orders. */
  committed: number
  /** On-hand level that triggers a replenishment. */
  reorderPoint: number
  /** Cost per unit in INR, used for inventory valuation. */
  unitCost: number
  updatedAt: string
}

export type InventorySummaryMetric = {
  id: string
  label: string
  value: string
  hint: string
  icon: LucideIcon
  tone?: 'default' | 'warning'
}
