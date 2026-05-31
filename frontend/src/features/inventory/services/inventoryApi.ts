import { api } from '@/shared/services'
import type { InventoryItem } from '../types/inventory.types'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

type BackendInventory = {
  _id: string
  productId: {
    _id: string
    name: string
    sku: string
    barcode?: string
    price?: number
    category?: string
  } | string
  storeId: {
    _id: string
    name: string
    location?: string
  } | string
  quantity: number
  reservedStock?: number
  minimumStockLevel?: number
  updatedAt: string
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

function toInventoryItem(row: BackendInventory): InventoryItem | null {
  if (typeof row.productId === 'string' || typeof row.storeId === 'string') {
    return null
  }
  return {
    id: row._id,
    sku: row.productId.sku,
    name: row.productId.name,
    category: row.productId.category ?? 'Uncategorised',
    locationId: row.storeId._id,
    onHand: row.quantity,
    committed: row.reservedStock ?? 0,
    reorderPoint: row.minimumStockLevel ?? 0,
    unitCost: row.productId.price ?? 0,
    updatedAt: formatRelative(row.updatedAt),
  }
}

export type InventoryLocation = {
  id: string
  code: string
  name: string
  type: 'store' | 'warehouse'
}

export const inventoryApi = {
  async listInventory(): Promise<{
    items: InventoryItem[]
    locations: InventoryLocation[]
    categories: string[]
  }> {
    const { data } = await api.get<
      ApiEnvelope<{ inventory: BackendInventory[] }>
    >('/inventory', { params: { limit: 500 } })

    const items: InventoryItem[] = []
    const locationsMap = new Map<string, InventoryLocation>()
    const categoriesSet = new Set<string>()

    for (const row of data.data.inventory) {
      const item = toInventoryItem(row)
      if (!item) continue
      items.push(item)

      if (
        typeof row.storeId !== 'string' &&
        !locationsMap.has(row.storeId._id)
      ) {
        locationsMap.set(row.storeId._id, {
          id: row.storeId._id,
          code: row.storeId.name?.slice(0, 3).toUpperCase() ?? 'STR',
          name: row.storeId.name,
          type: 'store',
        })
      }

      if (item.category) {
        categoriesSet.add(item.category)
      }
    }

    return {
      items,
      locations: Array.from(locationsMap.values()),
      categories: Array.from(categoriesSet).sort(),
    }
  },
}
