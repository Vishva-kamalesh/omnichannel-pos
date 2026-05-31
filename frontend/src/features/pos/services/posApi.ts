import { api } from '@/shared/services'
import type { Product, ProductCategory } from '../types/pos.types'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

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
  async listProductsWithStock(storeId: string): Promise<Product[]> {
    const [{ data: productsRes }, { data: invRes }] = await Promise.all([
      api.get<ApiEnvelope<{ products: BackendProduct[] }>>('/products', {
        params: { limit: 200, storeId },
      }),
      api.get<ApiEnvelope<{ inventory: BackendInventory[] }>>('/inventory', {
        params: { limit: 200, storeId },
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
      .map((p) => toProduct(p, stockMap.get(p._id) ?? p.stock ?? 0))
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
