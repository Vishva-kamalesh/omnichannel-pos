import { Minus, Plus, X } from 'lucide-react'
import { formatINR } from '../../data/posMock'
import { MAX_LINE_QTY, useCartStore, type CartLine } from '../../store/cartStore'
import styles from './CartLineItem.module.css'

type CartLineItemProps = {
  line: CartLine
}

export function CartLineItem({ line }: CartLineItemProps) {
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeLine = useCartStore((s) => s.removeLine)

  const { product, quantity } = line
  const lineTotal = product.price * quantity
  const atMax = quantity >= Math.min(product.stock, MAX_LINE_QTY)
  const taxLabel =
    product.taxRate === 0
      ? 'Tax exempt'
      : `GST ${Math.round(product.taxRate * 100)}%`

  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.meta}>
          {formatINR(product.price)} · {product.unit} · {taxLabel}
        </p>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => decrement(product.id)}
          aria-label={`Decrease ${product.name} quantity`}
        >
          <Minus size={13} strokeWidth={2.5} />
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => increment(product.id)}
          disabled={atMax}
          aria-label={`Increase ${product.name} quantity`}
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className={styles.totals}>
        <span className={styles.lineTotal}>{formatINR(lineTotal)}</span>
        <button
          type="button"
          className={styles.remove}
          onClick={() => removeLine(product.id)}
          aria-label={`Remove ${product.name} from cart`}
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </li>
  )
}
