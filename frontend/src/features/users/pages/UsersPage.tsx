import { useState } from 'react'
import { Search, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { TableSkeleton } from '@/shared/ui/Skeleton'
import { DataTable } from '@/shared/ui/DataTable'
import { useAsync } from '@/shared/hooks/useAsync'
import { useAuthStore } from '@/features/auth'
import { usersApi } from '../services/usersApi'
import { UserFormModal } from '../components/UserFormModal'
import styles from './UsersPage.module.css'

/** Up to two initials from a name, for the avatar chip. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const currentUser = useAuthStore((s) => s.user)
  const isAdmin = currentUser?.role === 'admin'

  const { data, loading, error, status, refetch } = useAsync(
    () =>
      usersApi.list({
        search: search.trim() || undefined,
        role: role || undefined,
      }),
    [search, role],
  )

  const users = data?.users ?? []
  const total = data?.pagination.total ?? 0

  async function handleDeactivate(id: string, name: string) {
    if (
      !window.confirm(
        `Deactivate ${name}? They will lose access immediately. You can re-enable them later from the backend.`,
      )
    ) {
      return
    }
    setRemovingId(id)
    try {
      await usersApi.deactivate(id)
      toast.success('User deactivated', { description: `${name} can no longer sign in.` })
      await refetch()
    } catch (err) {
      let message = 'Could not deactivate the user. Please try again.'
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast.error('Action failed', { description: message })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Users"
        description={`${total} staff member${total !== 1 ? 's' : ''} across all stores`}
        actions={
          isAdmin ? (
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => setAddOpen(true)}
            >
              <UserPlus size={15} strokeWidth={2} aria-hidden="true" />
              Add user
            </button>
          ) : undefined
        }
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
        status={status}
        onRetry={refetch}
        isEmpty={!loading && !error && users.length === 0}
        emptyMessage="No users found."
        skeleton={<TableSkeleton rows={8} columns={isAdmin ? 6 : 5} />}
      >
        <DataTable<(typeof users)[number]>
          data={users}
          rowKey={(u) => u._id}
          columns={[
            {
              key: 'user',
              header: 'User',
              render: (u) => (
                <div className={styles.userCell}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(u.name)}
                  </span>
                  <div>
                    <span className={styles.name}>{u.name}</span>
                    <span className={styles.email}>{u.email}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              render: (u) => (
                <span className={[styles.badge, styles.badgeRole].join(' ')}>
                  {u.role}
                </span>
              ),
            },
            {
              key: 'store',
              header: 'Store',
              render: (u) =>
                typeof u.storeId === 'object' && u.storeId
                  ? u.storeId.name
                  : '—',
            },
            {
              key: 'status',
              header: 'Status',
              render: (u) => (
                <span
                  className={[
                    styles.dot,
                    u.isActive ? styles.statusActive : styles.statusInactive,
                  ].join(' ')}
                >
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'joined',
              header: 'Joined',
              render: (u) =>
                new Date(u.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
            },
            ...(isAdmin
              ? [
                  {
                    key: 'actions',
                    header: 'Actions',
                    headerClassName: styles.actionsHead,
                    cellClassName: styles.actionsCell,
                    render: (u: (typeof users)[number]) =>
                      u._id === currentUser?._id ? (
                        <span className={styles.selfTag}>You</span>
                      ) : u.isActive ? (
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => handleDeactivate(u._id, u.name)}
                          disabled={removingId === u._id}
                          title={`Deactivate ${u.name}`}
                          aria-label={`Deactivate ${u.name}`}
                        >
                          <Trash2 size={15} strokeWidth={2} />
                          {removingId === u._id ? 'Removing…' : 'Remove'}
                        </button>
                      ) : (
                        <span className={styles.removedTag}>Deactivated</span>
                      ),
                  },
                ]
              : []),
          ]}
        />
      </AsyncBoundary>

      {isAdmin ? (
        <UserFormModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onCreated={refetch}
        />
      ) : null}
    </PageShell>
  )
}
