import { formatINR, getCategoryMeta, LOW_STOCK_THRESHOLD } from '../../data/posMock'
import { useCartStore } from '../../store/cartStore'
import type { Product } from '../../types/pos.types'
import { ProductImage } from '../ProductImage'
import styles from './ProductTile.module.css'

type ProductTileProps = {
  product: Product
}

export function ProductTile({ product }: ProductTileProps) {
  const addProduct = useCartStore((s) => s.addProduct)
  const quantityInCart = useCartStore(
    (s) => s.lines.find((l) => l.product.id === product.id)?.quantity ?? 0,
  )

  const category = getCategoryMeta(product.category)
  const outOfStock = product.stock === 0
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD
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
      <span className={styles.imageArea}>
        <ProductImage product={product} className={styles.image} />
        {quantityInCart > 0 ? (
          <span className={styles.qtyBadge}>{quantityInCart}</span>
        ) : null}
        {outOfStock ? (
          <span className={styles.outOfStock}>Out of stock</span>
        ) : null}
      </span>

      <span className={styles.body}>
        <span className={styles.category}>
          <span
            className={styles.dot}
            style={{ backgroundColor: category.accent }}
            aria-hidden="true"
          />
          {category.label}
        </span>

        <span className={styles.name}>{product.name}</span>
        <span className={styles.sku}>{product.sku}</span>

        <span className={styles.bottom}>
          <span className={styles.price}>{formatINR(product.price)}</span>
          {outOfStock ? null : lowStock ? (
            <span className={[styles.stock, styles.stockLow].join(' ')}>
              Low · {product.stock}
            </span>
          ) : (
            <span className={styles.stock}>{product.stock} left</span>
          )}
        </span>
      </span>
    </button>
  )
}
