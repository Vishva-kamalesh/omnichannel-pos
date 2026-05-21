import { create } from 'zustand'
import type { Product } from '../types/pos.types'

export type CartLine = {
  product: Product
  quantity: number
}

/** Quick-apply discount rates (percentage) shown in the cart. */
export const DISCOUNT_OPTIONS = [0, 5, 10, 15] as const

/** Maximum units allowed on a single cart line. */
export const MAX_LINE_QTY = 99

type CartState = {
  lines: CartLine[]
  discountRate: number
  addProduct: (product: Product) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  removeLine: (productId: string) => void
  clearCart: () => void
  setDiscountRate: (rate: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  discountRate: 0,

  addProduct: (product) =>
    set((state) => {
      const existing = state.lines.find((l) => l.product.id === product.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === product.id
              ? { ...l, quantity: Math.min(l.quantity + 1, MAX_LINE_QTY) }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, { product, quantity: 1 }] }
    }),

  increment: (productId) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.product.id === productId
          ? { ...l, quantity: Math.min(l.quantity + 1, MAX_LINE_QTY) }
          : l,
      ),
    })),

  decrement: (productId) =>
    set((state) => ({
      lines: state.lines
        .map((l) =>
          l.product.id === productId ? { ...l, quantity: l.quantity - 1 } : l,
        )
        .filter((l) => l.quantity > 0),
    })),

  removeLine: (productId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.product.id !== productId),
    })),

  clearCart: () => set({ lines: [], discountRate: 0 }),

  setDiscountRate: (rate) => set({ discountRate: rate }),
}))

export type CartSummary = {
  lineCount: number
  unitCount: number
  subtotal: number
  discountRate: number
  discountAmount: number
  taxAmount: number
  total: number
}

/** Derive bill totals. Tax is computed per line on the post-discount value. */
export function getCartSummary(
  lines: CartLine[],
  discountRate: number,
): CartSummary {
  const discountFactor = 1 - discountRate / 100
  let subtotal = 0
  let unitCount = 0
  let taxAmount = 0

  for (const { product, quantity } of lines) {
    const lineValue = product.price * quantity
    subtotal += lineValue
    unitCount += quantity
    taxAmount += lineValue * discountFactor * product.taxRate
  }

  const discountAmount = subtotal * (discountRate / 100)
  const total = subtotal - discountAmount + taxAmount

  return {
    lineCount: lines.length,
    unitCount,
    subtotal,
    discountRate,
    discountAmount,
    taxAmount,
    total,
  }
}
