import { Banknote, CreditCard, Smartphone, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatINR } from '../../data/posMock'
import type { PaymentMethodId } from '../../types/pos.types'
import styles from './PaymentMethods.module.css'

const METHODS: { id: PaymentMethodId; label: string; icon: LucideIcon }[] = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
]

type PaymentMethodsProps = {
  selected: PaymentMethodId
  onSelect: (id: PaymentMethodId) => void
  total: number
  disabled: boolean
  onCheckout: () => void
}

export function PaymentMethods({
  selected,
  onSelect,
  total,
  disabled,
  onCheckout,
}: PaymentMethodsProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Payment method</p>

      <div className={styles.methods}>
        {METHODS.map(({ id, label, icon: Icon }) => {
          const isActive = id === selected
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              className={[styles.method, isActive ? styles.methodActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(id)}
            >
              <Icon size={17} strokeWidth={2} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={styles.checkout}
        onClick={onCheckout}
        disabled={disabled}
      >
        {disabled ? 'Add items to checkout' : `Charge ${formatINR(total)}`}
      </button>
    </div>
  )
}
