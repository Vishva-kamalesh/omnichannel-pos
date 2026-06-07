import { PageHeader } from '@/shared/ui/PageHeader'
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

export function DashboardPage() {
  const { data, loading, error, status, refetch } = useAsync(
    () => dashboardApi.loadDashboard(),
    [],
  )

  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description={`${formatToday()} · All locations · INR`}
        descriptionMono
        actions={
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.exportBtn}
              onClick={() => refetch()}
            >
              Refresh
            </button>
          </div>
        }
      />

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
