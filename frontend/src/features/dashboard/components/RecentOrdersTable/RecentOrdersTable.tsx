import type { RecentOrder } from '../../types/dashboard.types'
import { DashboardPanel } from '../DashboardPanel'
import { StatusBadge } from '../StatusBadge'
import styles from './RecentOrdersTable.module.css'

type RecentOrdersTableProps = {
  orders: RecentOrder[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <DashboardPanel title="Recent orders" meta="Live feed" noPadding>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Store</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.time}>{order.placedAt}</span>
                </td>
                <td>{order.customer}</td>
                <td className={styles.store}>{order.store}</td>
                <td className={styles.amount}>{order.amount}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  )
}
