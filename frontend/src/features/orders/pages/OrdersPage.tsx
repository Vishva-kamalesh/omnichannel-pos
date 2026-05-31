import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { useAsync } from '@/shared/hooks/useAsync'
import { ordersApi } from '../services/ordersApi'
import styles from './OrdersPage.module.css'

const PAGE_SIZE = 15

function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  completed: { label: 'Completed', class: 'badgeCompleted' },
  returned: { label: 'Refunded', class: 'badgeRefunded' },
  cancelled: { label: 'Cancelled', class: 'badgeCancelled' },
}

export function OrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, refetch } = useAsync(
    () =>
      ordersApi.list({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        status: status || undefined,
        paymentMethod: paymentMethod || undefined,
      }),
    [page, search, status, paymentMethod],
  )

  const orders = data?.orders ?? []
  const pagination = data?.pagination

  return (
    <PageShell>
      <PageHeader
        title="Orders"
        description="All sales recorded across stores and channels"
      />

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={15} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by order number"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="returned">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className={styles.select}
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={!loading && !error && orders.length === 0}
        emptyMessage="No orders yet. Make a sale from POS to see them here."
      >
        <div className={styles.tableWrap}>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Cashier · Store</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className={styles.numericCol}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const cashier =
                    typeof order.cashierId === 'object'
                      ? order.cashierId?.name
                      : '—'
                  const store =
                    typeof order.storeId === 'object'
                      ? order.storeId?.name
                      : '—'
                  const itemCount = order.items.reduce(
                    (sum, it) => sum + it.quantity,
                    0,
                  )
                  const statusInfo =
                    STATUS_LABELS[order.status] ?? {
                      label: order.status,
                      class: 'badgeCompleted',
                    }
                  return (
                    <tr key={order._id}>
                      <td>
                        <span className={styles.orderNo}>
                          {order.orderNumber}
                        </span>
                        <span className={styles.subText}>
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        {cashier}
                        <span className={styles.subText}>{store}</span>
                      </td>
                      <td>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                        <span className={styles.subText}>
                          {order.items
                            .slice(0, 2)
                            .map((it) => it.name)
                            .join(', ')}
                          {order.items.length > 2
                            ? ` +${order.items.length - 2} more`
                            : ''}
                        </span>
                      </td>
                      <td>
                        <span className={styles.method}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <span
                          className={[
                            styles.badge,
                            styles[statusInfo.class],
                          ].join(' ')}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className={styles.amount}>
                        {formatINR(order.finalAmount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {pagination ? (
            <div className={styles.footer}>
              <span>
                Showing page {pagination.page} of {pagination.pages} ·{' '}
                {pagination.total} order{pagination.total !== 1 ? 's' : ''}
              </span>
              <div className={styles.pager}>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </AsyncBoundary>
    </PageShell>
  )
}
