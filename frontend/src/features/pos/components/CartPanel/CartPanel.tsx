import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronsUpDown,
  Pause,
  ShoppingCart,
  Trash2,
  UserRound,
} from 'lucide-react'
import axios from 'axios'
import { formatINR } from '../../data/posMock'
import { posApi } from '../../services/posApi'
import {
  DISCOUNT_OPTIONS,
  getCartSummary,
  useCartStore,
} from '../../store/cartStore'
import type { PaymentMethodId } from '../../types/pos.types'
import { CartLineItem } from '../CartLineItem'
import { OrderSummary } from '../OrderSummary'
import { PaymentMethods } from '../PaymentMethods'
import styles from './CartPanel.module.css'

const PAYMENT_LABELS: Record<PaymentMethodId, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  wallet: 'Wallet',
}

const PAYMENT_BACKEND_MAP: Record<PaymentMethodId, 'cash' | 'card' | 'upi' | 'credit'> = {
  cash: 'cash',
  card: 'card',
  upi: 'upi',
  wallet: 'credit',
}

type Receipt = {
  orderNo: string
  total: number
  method: PaymentMethodId
}

type CartPanelProps = {
  storeId: string
  onCheckoutComplete?: () => void | Promise<void>
}

export function CartPanel({ storeId, onCheckoutComplete }: CartPanelProps) {
  const lines = useCartStore((s) => s.lines)
  const discountRate = useCartStore((s) => s.discountRate)
  const setDiscountRate = useCartStore((s) => s.setDiscountRate)
  const clearCart = useCartStore((s) => s.clearCart)

  const [payment, setPayment] = useState<PaymentMethodId>('cash')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const receiptTimer = useRef<number | undefined>(undefined)

  const summary = getCartSummary(lines, discountRate)
  const isEmpty = lines.length === 0

  // Keep the most recently scanned line in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [lines.length])

  useEffect(() => () => window.clearTimeout(receiptTimer.current), [])

  async function handleCheckout() {
    if (isEmpty || submitting) return
    setSubmitting(true)
    setCheckoutError(null)
    try {
      const order = await posApi.createOrder({
        storeId,
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        paymentMethod: PAYMENT_BACKEND_MAP[payment],
        tax: Math.round(summary.taxAmount * 100) / 100,
        discount: Math.round(summary.discountAmount * 100) / 100,
      })
      setReceipt({
        orderNo: order.orderNumber,
        total: order.finalAmount,
        method: payment,
      })
      clearCart()
      window.clearTimeout(receiptTimer.current)
      receiptTimer.current = window.setTimeout(() => setReceipt(null), 6000)
      await onCheckoutComplete?.()
    } catch (err) {
      let message = 'Checkout failed. Please try again.'
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      setCheckoutError(message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleClear() {
    clearCart()
    setReceipt(null)
    setCheckoutError(null)
  }

  return (
    <section className={styles.panel} aria-label="Current sale">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h2 className={styles.title}>Current Sale</h2>
            <p className={styles.orderNo}>Register 02 · Live</p>
          </div>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            disabled={isEmpty}
          >
            <Trash2 size={14} strokeWidth={2} />
            Clear
          </button>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.customerBtn}>
            <UserRound size={15} strokeWidth={2} aria-hidden="true" />
            <span className={styles.customerName}>Walk-in customer</span>
            <ChevronsUpDown size={14} strokeWidth={2} aria-hidden="true" />
          </button>
          <button type="button" className={styles.holdBtn} disabled={isEmpty}>
            <Pause size={14} strokeWidth={2} />
            Hold
          </button>
        </div>
      </header>

      {isEmpty ? (
        receipt ? (
          <div className={styles.state}>
            <span className={styles.receiptIcon}>
              <CheckCircle2 size={26} strokeWidth={2} aria-hidden="true" />
            </span>
            <p className={styles.stateTitle}>Payment received</p>
            <p className={styles.receiptMeta}>
              {receipt.orderNo} · {formatINR(receipt.total)} ·{' '}
              {PAYMENT_LABELS[receipt.method]}
            </p>
            <p className={styles.stateHint}>
              Receipt sent to the counter printer.
            </p>
            <button
              type="button"
              className={styles.newSaleBtn}
              onClick={() => setReceipt(null)}
            >
              Start new sale
            </button>
          </div>
        ) : (
          <div className={styles.state}>
            <span className={styles.emptyIcon}>
              <ShoppingCart size={26} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className={styles.stateTitle}>Cart is empty</p>
            <p className={styles.stateHint}>
              Scan a barcode or tap a product to start the sale.
            </p>
          </div>
        )
      ) : (
        <ul className={styles.list} ref={listRef}>
          {lines.map((line) => (
            <CartLineItem key={line.product.id} line={line} />
          ))}
        </ul>
      )}

      <footer className={styles.footer}>
        <div className={styles.discount}>
          <span className={styles.discountLabel}>Discount</span>
          <div className={styles.discountChips}>
            {DISCOUNT_OPTIONS.map((rate) => (
              <button
                key={rate}
                type="button"
                className={[
                  styles.chip,
                  rate === discountRate ? styles.chipActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setDiscountRate(rate)}
                disabled={isEmpty}
              >
                {rate === 0 ? 'None' : `${rate}%`}
              </button>
            ))}
          </div>
        </div>

        <OrderSummary summary={summary} />

        {checkoutError ? (
          <div className={styles.checkoutError} role="alert">
            <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
            <span>{checkoutError}</span>
          </div>
        ) : null}

        <PaymentMethods
          selected={payment}
          onSelect={setPayment}
          total={summary.total}
          disabled={isEmpty || submitting}
          onCheckout={handleCheckout}
        />
      </footer>
    </section>
  )
}
