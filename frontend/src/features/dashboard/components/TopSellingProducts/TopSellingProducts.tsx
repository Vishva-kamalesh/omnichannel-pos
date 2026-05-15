import type { TopProduct } from '../../types/dashboard.types'
import { DashboardPanel } from '../DashboardPanel'
import styles from './TopSellingProducts.module.css'

type TopSellingProductsProps = {
  products: TopProduct[]
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <DashboardPanel title="Top selling products" meta="Last 30 days">
      <ol className={styles.list}>
        {products.map((product, index) => (
          <li key={product.id} className={styles.item}>
            <span className={styles.rank}>{index + 1}</span>
            <div className={styles.info}>
              <p className={styles.name}>{product.name}</p>
              <p className={styles.sku}>{product.sku}</p>
            </div>
            <div className={styles.stats}>
              <span className={styles.units}>{product.unitsSold} sold</span>
              <span className={styles.revenue}>{product.revenue}</span>
            </div>
            <span
              className={[
                styles.trend,
                product.trend >= 0 ? styles.trendUp : styles.trendDown,
              ].join(' ')}
            >
              {product.trend >= 0 ? '+' : ''}
              {product.trend}%
            </span>
          </li>
        ))}
      </ol>
    </DashboardPanel>
  )
}
