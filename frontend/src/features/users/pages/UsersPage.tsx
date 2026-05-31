import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { useAsync } from '@/shared/hooks/useAsync'
import { usersApi } from '../services/usersApi'
import styles from './UsersPage.module.css'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

const ROLE_STYLE: Record<string, string> = {
  admin: 'badgeAdmin',
  manager: 'badgeManager',
  cashier: 'badgeCashier',
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')

  const { data, loading, error, refetch } = useAsync(
    () =>
      usersApi.list({
        search: search.trim() || undefined,
        role: role || undefined,
      }),
    [search, role],
  )

  const users = data?.users ?? []
  const total = data?.pagination.total ?? 0

  return (
    <PageShell>
      <PageHeader
        title="Users"
        description={`${total} staff member${total !== 1 ? 's' : ''} across all stores`}
      />

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={15} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
        </select>
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={!loading && !error && users.length === 0}
        emptyMessage="No users found."
      >
        <div className={styles.tableWrap}>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Store</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const storeName =
                    typeof user.storeId === 'object' && user.storeId
                      ? user.storeId.name
                      : '—'
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className={styles.userCell}>
                          <span className={styles.avatar}>
                            {initials(user.name)}
                          </span>
                          <div>
                            <span className={styles.name}>{user.name}</span>
                            <span className={styles.email}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={[
                            styles.badge,
                            styles[ROLE_STYLE[user.role] ?? 'badgeCashier'],
                          ].join(' ')}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{storeName}</td>
                      <td>
                        <span
                          className={[
                            styles.dot,
                            user.isActive
                              ? styles.statusActive
                              : styles.statusInactive,
                          ].join(' ')}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AsyncBoundary>
    </PageShell>
  )
}
