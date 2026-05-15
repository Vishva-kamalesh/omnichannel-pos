import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import {
  KPI_METRICS,
  LOW_STOCK_ITEMS,
  RECENT_TRANSACTIONS,
  REVENUE_BY_CHANNEL,
  REVENUE_COMPARISON,
  TOP_PRODUCTS,
} from '../data/dashboardMock'
import {
  KpiGrid,
  LowStockAlerts,
  RecentTransactionsTable,
  RevenueOverview,
  SalesChartSection,
  TopSellingProducts,
} from '../components'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description="Tuesday, 19 May 2026 · All locations · INR"
        actions={
          <div className={styles.headerActions}>
            <select className={styles.locationSelect} defaultValue="all" aria-label="Location filter">
              <option value="all">All locations</option>
              <option value="flagship">Downtown Flagship</option>
              <option value="mall">Mall Outlet</option>
              <option value="warehouse">Warehouse — West</option>
            </select>
            <button type="button" className={styles.exportBtn}>
              Export
            </button>
          </div>
        }
      />

      <KpiGrid metrics={KPI_METRICS} />

      <div className={styles.analyticsRow}>
        <div className={styles.primaryCol}>
          <SalesChartSection />
        </div>
        <div className={styles.secondaryCol}>
          <RevenueOverview
            channels={REVENUE_BY_CHANNEL}
            comparison={REVENUE_COMPARISON}
          />
        </div>
      </div>

      <div className={styles.transactionsRow}>
        <RecentTransactionsTable transactions={RECENT_TRANSACTIONS} />
      </div>

      <div className={styles.insightsRow}>
        <LowStockAlerts items={LOW_STOCK_ITEMS} />
        <TopSellingProducts products={TOP_PRODUCTS} />
      </div>
    </PageShell>
  )
}
