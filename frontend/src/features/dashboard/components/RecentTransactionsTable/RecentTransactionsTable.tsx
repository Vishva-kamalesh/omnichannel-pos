import type { Transaction } from '../../types/dashboard.types'
import { DashboardPanel } from '../DashboardPanel'
import { StatusBadge } from '../StatusBadge'
import styles from './RecentTransactionsTable.module.css'

const CHANNEL_LABELS: Record<Transaction['channel'], string> = {
  'in-store': 'In-store',
  online: 'Online',
  warehouse: 'Warehouse',
}

type RecentTransactionsTableProps = {
  transactions: Transaction[]
}

export function RecentTransactionsTable({
  transactions,
}: RecentTransactionsTableProps) {
  return (
    <DashboardPanel title="Recent transactions" meta="Live feed" noPadding>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Customer</th>
              <th scope="col">Store</th>
              <th scope="col">Channel</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>
                  <span className={styles.txnId}>{txn.id}</span>
                  <span className={styles.time}>{txn.placedAt}</span>
                </td>
                <td>{txn.customer}</td>
                <td className={styles.store}>{txn.store}</td>
                <td>
                  <span className={styles.channel}>
                    {CHANNEL_LABELS[txn.channel]}
                  </span>
                </td>
                <td className={styles.amount}>{txn.amount}</td>
                <td>
                  <StatusBadge status={txn.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  )
}
