import { api } from '@/shared/services'
import type { Product } from '../types/product.types'

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
  isActive: boolean
  storeId?: string | { _id: string }
  createdAt: string
  updatedAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toProduct(p: BackendProduct): Product {
  return {
    id: p._id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    status: p.isActive ? 'active' : 'archived',
    variants: [
      {
        id: `${p._id}-default`,
        size: 'Default',
        color: 'Default',
        stock: p.stock,
      },
    ],
    updatedAt: formatDate(p.updatedAt ?? p.createdAt),
  }
}

export const productsApi = {
  async list(params: { search?: string; category?: string } = {}) {
    const { data } = await api.get<
      ApiEnvelope<{ products: BackendProduct[] }>
    >('/products', { params: { limit: 200, ...params } })

    const products = data.data.products.map(toProduct)
    const categoriesSet = new Set<string>()
    for (const p of data.data.products) {
      if (p.category) categoriesSet.add(p.category)
    }
    return {
      products,
      categories: Array.from(categoriesSet).sort(),
    }
  },
}
