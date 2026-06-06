import { api } from '@/shared/services'
import type { Product, ProductCategory, StoreOption } from '../types/pos.types'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

type BackendStore = {
  _id: string
  name: string
  location?: string
}

type BackendProduct = {
  _id: string
  name: string
  sku: string
  barcode?: string
  category: string
  price: number
  costPrice: number
  stock: number
  storeId: string | { _id: string }
  isActive: boolean
}

type BackendInventory = {
  _id: string
  productId: { _id: string; name: string; sku: string; barcode?: string } | string
  storeId: string | { _id: string; name: string }
  quantity: number
  reservedStock?: number
  minimumStockLevel?: number
}

const CATEGORY_MAP: Record<string, ProductCategory> = {
  grocery: 'grocery',
  beverages: 'beverages',
  bakery: 'bakery',
  dairy: 'dairy',
  snacks: 'snacks',
  'personal-care': 'personal-care',
  'personal care': 'personal-care',
  household: 'household',
}

function normaliseCategory(value: string): ProductCategory {
  const key = value.trim().toLowerCase()
  return CATEGORY_MAP[key] ?? 'grocery'
}

function toProduct(p: BackendProduct, stock: number): Product {
  return {
    id: p._id,
    name: p.name,
    sku: p.sku,
    barcode: p.barcode ?? '',
    price: p.price,
    unit: 'ea',
    category: normaliseCategory(p.category),
    taxRate: 0.05,
    stock,
  }
}

export const posApi = {
  /** Active stores the terminal can sell from — powers the header store picker. */
  async listStores(): Promise<StoreOption[]> {
    const { data } = await api.get<ApiEnvelope<{ stores: BackendStore[] }>>(
      '/stores',
      { params: { limit: 50, isActive: 'true' } },
    )
    return data.data.stores.map((s) => ({
      id: s._id,
      name: s.name,
      location: s.location ?? '',
    }))
  },

  async listProductsWithStock(storeId: string): Promise<Product[]> {
    // The product catalog is global; per-store availability is tracked in the
    // Inventory collection (and that's what checkout validates against — see the
    // backend order service). So we load the full catalog and overlay the
    // selected store's on-hand stock, rather than filtering products by storeId
    // (products are only "owned" by their creating store, not stocked by it).
    const [{ data: productsRes }, { data: invRes }] = await Promise.all([
      api.get<ApiEnvelope<{ products: BackendProduct[] }>>('/products', {
        params: { limit: 200 },
      }),
      api.get<ApiEnvelope<{ inventory: BackendInventory[] }>>('/inventory', {
        params: { limit: 500, storeId },
      }),
    ])

    const stockMap = new Map<string, number>()
    for (const row of invRes.data.inventory) {
      const pid =
        typeof row.productId === 'string' ? row.productId : row.productId?._id
      if (pid) stockMap.set(pid, row.quantity)
    }

    return productsRes.data.products
      .filter((p) => p.isActive)
      .map((p) => toProduct(p, stockMap.get(p._id) ?? 0))
  },

  async createOrder(payload: {
    storeId: string
    items: { productId: string; quantity: number }[]
    paymentMethod: 'cash' | 'card' | 'upi' | 'credit'
    tax: number
    discount: number
    notes?: string
  }) {
    const { data } = await api.post<ApiEnvelope<{ _id: string; orderNumber: string; finalAmount: number }>>(
      '/orders',
      payload,
    )
    return data.data
  },
}
