import { Pencil } from 'lucide-react'
import {
  formatPrice,
  getColorHex,
  getTotalStock,
  getVariantColors,
} from '../../data/productsMock'
import type { Product } from '../../types/product.types'
import { ProductStatusBadge } from '../ProductStatusBadge'
import { ProductThumbnail } from '../ProductThumbnail'
import styles from './ProductsTable.module.css'

const MAX_SWATCHES = 4

type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
}

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No products found</p>
        <p className={styles.emptyHint}>
          Adjust your search or filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col" className={styles.alignRight}>
              Price
            </th>
            <th scope="col">Variants</th>
            <th scope="col" className={styles.alignRight}>
              Stock
            </th>
            <th scope="col">Status</th>
            <th scope="col">Updated</th>
            <th scope="col">
              <span className={styles.srOnly}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const colors = getVariantColors(product)
            const totalStock = getTotalStock(product)
            return (
              <tr key={product.id}>
                <td>
                  <div className={styles.product}>
                    <ProductThumbnail
                      name={product.name}
                      category={product.category}
                    />
                    <div className={styles.productText}>
                      <span className={styles.productName}>
                        {product.name}
                      </span>
                      <span className={styles.sku}>{product.sku}</span>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td className={styles.alignRight}>
                  <span className={styles.price}>
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td>
                  <div className={styles.variants}>
                    <span className={styles.variantCount}>
                      {product.variants.length} variants
                    </span>
                    <div className={styles.swatches}>
                      {colors.slice(0, MAX_SWATCHES).map((color) => (
                        <span
                          key={color}
                          className={styles.swatch}
                          style={{ backgroundColor: getColorHex(color) }}
                          title={color}
                        />
                      ))}
                      {colors.length > MAX_SWATCHES ? (
                        <span className={styles.swatchMore}>
                          +{colors.length - MAX_SWATCHES}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className={styles.alignRight}>
                  <span
                    className={
                      totalStock === 0 ? styles.stockEmpty : styles.stock
                    }
                  >
                    {totalStock.toLocaleString('en-IN')}
                  </span>
                </td>
                <td>
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className={styles.updated}>{product.updatedAt}</td>
                <td>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    <Pencil size={14} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
