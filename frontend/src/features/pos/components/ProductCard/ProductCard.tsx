import { formatINR, getCategoryMeta, LOW_STOCK_THRESHOLD } from '../../data/posMock'
import { useCartStore } from '../../store/cartStore'
import type { Product } from '../../types/pos.types'
import styles from './ProductCard.module.css'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addProduct = useCartStore((s) => s.addProduct)
  const quantityInCart = useCartStore(
    (s) => s.lines.find((l) => l.product.id === product.id)?.quantity ?? 0,
  )

  const category = getCategoryMeta(product.category)
  const outOfStock = product.stock === 0
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD
  // Stop adding once the cart holds every unit on hand.
  const atStockLimit = quantityInCart >= product.stock

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => addProduct(product)}
      disabled={atStockLimit}
      aria-label={
        outOfStock
          ? `${product.name} is out of stock`
          : atStockLimit
            ? `All ${product.stock} units of ${product.name} are in the cart`
            : `Add ${product.name} to cart`
      }
    >
      <div className={styles.top}>
        <span className={styles.category}>
          <span
            className={styles.dot}
            style={{ backgroundColor: category.accent }}
            aria-hidden="true"
          />
          {category.label}
        </span>
        {quantityInCart > 0 ? (
          <span className={styles.inCart}>{quantityInCart} in cart</span>
        ) : outOfStock ? (
          <span className={[styles.stock, styles.stockOut].join(' ')}>
            Out of stock
          </span>
        ) : lowStock ? (
          <span className={[styles.stock, styles.stockLow].join(' ')}>
            Low · {product.stock}
          </span>
        ) : (
          <span className={styles.stock}>{product.stock} in stock</span>
        )}
      </div>

      <p className={styles.name}>{product.name}</p>

      <div className={styles.bottom}>
        <span className={styles.priceGroup}>
          <span className={styles.price}>{formatINR(product.price)}</span>
          <span className={styles.unit}>/ {product.unit}</span>
        </span>
        <span className={styles.sku}>{product.sku}</span>
      </div>
    </button>
  )
}
