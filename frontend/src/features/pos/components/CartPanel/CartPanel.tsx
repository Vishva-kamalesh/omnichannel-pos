import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Smartphone,
  Trash2,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import axios from 'axios'
import { formatINR } from '../../data/posMock'
import { posApi } from '../../services/posApi'
import {
  DISCOUNT_OPTIONS,
  getCartSummary,
  useCartStore,
} from '../../store/cartStore'
import type { CartLine } from '../../store/cartStore'
import type { PaymentMethodId } from '../../types/pos.types'
import { ProductImage } from '../ProductImage'
import styles from './CartPanel.module.css'

const PAYMENT_METHODS: { id: PaymentMethodId; label: string; icon: LucideIcon }[] =
  [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ]

const PAYMENT_LABELS: Record<PaymentMethodId, string> = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  wallet: 'Wallet',
}

const PAYMENT_BACKEND_MAP: Record<
  PaymentMethodId,
  'cash' | 'card' | 'upi' | 'credit'
> = {
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

/** A single editable line in the running sale. */
function CartLineRow({ line }: { line: CartLine }) {
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const { product, quantity } = line

  return (
    <li className={styles.line}>
      <ProductImage product={product} className={styles.lineImg} />
      <div className={styles.lineInfo}>
        <p className={styles.lineName}>{product.name}</p>
        <p className={styles.lineMeta}>
          {formatINR(product.price)} · {product.unit}
        </p>
        <div className={styles.stepper}>
          {/* Stepping down from 1 removes the line (the store drops qty 0). */}
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => decrement(product.id)}
            aria-label={
              quantity === 1
                ? `Remove ${product.name}`
                : `Decrease ${product.name}`
            }
          >
            <Minus size={15} strokeWidth={2} />
          </button>
          <span className={styles.qty}>{quantity}</span>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => increment(product.id)}
            disabled={quantity >= product.stock}
            aria-label={`Increase ${product.name}`}
          >
            <Plus size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
      <span className={styles.lineTotal}>
        {formatINR(product.price * quantity)}
      </span>
    </li>
  )
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

  // Keep the most recently added line in view.
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
        <div>
          <h2 className={styles.title}>Current sale</h2>
          <p className={styles.subtitle}>
            {isEmpty
              ? 'Register 02'
              : `${summary.unitCount} item${summary.unitCount === 1 ? '' : 's'} · Register 02`}
          </p>
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
      </header>

      {isEmpty ? (
        receipt ? (
          <div className={styles.state}>
            <span className={styles.receiptIcon}>
              <CheckCircle2 size={28} strokeWidth={2} aria-hidden="true" />
            </span>
            <p className={styles.stateTitle}>Payment received</p>
            <p className={styles.receiptMeta}>
              {receipt.orderNo} · {formatINR(receipt.total)} ·{' '}
              {PAYMENT_LABELS[receipt.method]}
            </p>
            <p className={styles.stateHint}>Receipt sent to the counter printer.</p>
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
              <ShoppingCart size={28} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className={styles.stateTitle}>Cart is empty</p>
            <p className={styles.stateHint}>
              Tap a product or search to start the sale.
            </p>
          </div>
        )
      ) : (
        <ul className={styles.list} ref={listRef}>
          {lines.map((line) => (
            <CartLineRow key={line.product.id} line={line} />
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

        <dl className={styles.summary}>
          <div className={styles.summaryRow}>
            <dt>Subtotal</dt>
            <dd>{formatINR(summary.subtotal)}</dd>
          </div>
          {summary.discountAmount > 0 ? (
            <div className={styles.summaryRow}>
              <dt>Discount ({summary.discountRate}%)</dt>
              <dd className={styles.summaryNeg}>
                −{formatINR(summary.discountAmount)}
              </dd>
            </div>
          ) : null}
          <div className={styles.summaryRow}>
            <dt>Tax (GST)</dt>
            <dd>{formatINR(summary.taxAmount)}</dd>
          </div>
          <div className={[styles.summaryRow, styles.summaryTotal].join(' ')}>
            <dt>Total</dt>
            <dd>{formatINR(summary.total)}</dd>
          </div>
        </dl>

        <div className={styles.payment}>
          <span className={styles.paymentLabel}>Payment method</span>
          <div className={styles.methods}>
            {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
              const isActive = id === payment
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  className={[
                    styles.method,
                    isActive ? styles.methodActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setPayment(id)}
                >
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {checkoutError ? (
          <div className={styles.checkoutError} role="alert">
            <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
            <span>{checkoutError}</span>
          </div>
        ) : null}

        <button
          type="button"
          className={[styles.checkout, isEmpty ? styles.checkoutEmpty : '']
            .filter(Boolean)
            .join(' ')}
          onClick={handleCheckout}
          disabled={isEmpty || submitting}
        >
          {submitting
            ? 'Processing…'
            : isEmpty
              ? 'Add items to checkout'
              : `Charge ${formatINR(summary.total)}`}
        </button>
      </footer>
    </section>
  )
}
