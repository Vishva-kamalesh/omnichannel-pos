import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { useAsync } from '@/shared/hooks/useAsync'
import { dashboardApi } from '../services/dashboardApi'
import {
  KpiGrid,
  LowStockAlerts,
  RecentTransactionsTable,
  TopSellingProducts,
} from '../components'
import styles from './DashboardPage.module.css'

function formatToday(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Time-of-day greeting based on the current hour. */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}

export function DashboardPage() {
  const { data, loading, error, status, refetch } = useAsync(
    () => dashboardApi.loadDashboard(),
    [],
  )

  return (
    <PageShell>
      <header className={styles.dashHeader}>
        <div className={styles.dashHeadText}>
          <h1 className={styles.welcomeTitle}>{getGreeting()}, Admin</h1>
          <p className={styles.welcomeSub}>
            Here's how every store is performing today.
          </p>
          <p className={styles.metaLine}>{`${formatToday()} · All locations · INR`}</p>
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </header>

      <AsyncBoundary loading={loading} error={error} status={status} onRetry={refetch}>
        {data ? (
          <>
            <KpiGrid metrics={data.kpis} />

            <div className={styles.transactionsRow}>
              <RecentTransactionsTable transactions={data.recentTransactions} />
            </div>

            <div className={styles.insightsRow}>
              <LowStockAlerts items={data.lowStock} />
              <TopSellingProducts products={data.topProducts} />
            </div>
          </>
        ) : null}
      </AsyncBoundary>
    </PageShell>
  )
}
