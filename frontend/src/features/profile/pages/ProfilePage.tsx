import {
  ArrowRight,
  CalendarDays,
  Clock,
  Hash,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import {
  DEFAULT_STORE_NAME,
  MAIN_NAVIGATION,
  ROUTES,
  filterNavigationByRole,
  getDefaultRouteForRole,
} from '@/shared/constants'
import { PageShell } from '@/shared/ui/PageShell'
import { PageHeader } from '@/shared/ui/PageHeader'
import { avatarFallback, avatarImage } from '@/shared/utils/images'
import styles from './ProfilePage.module.css'

function formatRole(role?: string): string {
  if (!role) return 'Team member'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

type DetailRow = {
  icon: LucideIcon
  label: string
  value: string
  mono?: boolean
}

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  if (!user) {
    return (
      <PageShell>
        <PageHeader title="Profile" description="Your account details" />
        <p className={styles.empty}>You are not signed in.</p>
      </PageShell>
    )
  }

  const role = formatRole(user.role)
  const avatarSeed = user.email
  const storeLabel = user.storeId ? DEFAULT_STORE_NAME : 'All stores'
  const landingPath = getDefaultRouteForRole(user.role)
  const landingLabel = user.role === 'cashier' ? 'POS Terminal' : 'Dashboard'
  const accessItems = filterNavigationByRole(MAIN_NAVIGATION, user.role).flatMap(
    (section) => section.items,
  )

  const details: DetailRow[] = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: ShieldCheck, label: 'Role', value: role },
    { icon: MapPin, label: 'Store', value: storeLabel },
    { icon: CalendarDays, label: 'Member since', value: formatDate(user.createdAt) },
    { icon: Clock, label: 'Last updated', value: formatDate(user.updatedAt) },
    {
      icon: Hash,
      label: 'Account ID',
      value: user._id ?? user.id ?? '—',
      mono: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Profile"
        description="Your account details and workspace access"
      />

      <div className={styles.grid}>
        <section className={styles.identityCard}>
          <img
            className={styles.avatar}
            src={avatarImage(avatarSeed, 220)}
            alt={`${user.name} avatar`}
            onError={(e) => {
              // Photo failed → illustrated avatar, never initials.
              const img = e.currentTarget
              if (img.dataset.fallback) return
              img.dataset.fallback = '1'
              img.src = avatarFallback(avatarSeed)
            }}
          />

          <h3 className={styles.name}>{user.name}</h3>
          <span
            className={[styles.roleBadge, styles[`role_${user.role}`]]
              .filter(Boolean)
              .join(' ')}
          >
            {role}
          </span>
          <p className={styles.email}>{user.email}</p>

          <span
            className={[
              styles.status,
              user.isActive ? styles.statusActive : styles.statusInactive,
            ].join(' ')}
          >
            <span className={styles.statusDot} aria-hidden="true" />
            {user.isActive ? 'Active' : 'Inactive'}
          </span>

          <div className={styles.divider} />

          <div className={styles.actions}>
            <button
              type="button"
              className={[styles.actionBtn, styles.actionPrimary].join(' ')}
              onClick={() => navigate(landingPath)}
            >
              Go to {landingLabel}
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={[styles.actionBtn, styles.actionSignOut].join(' ')}
              onClick={handleLogout}
            >
              <LogOut size={15} strokeWidth={2} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </section>

        <div className={styles.rightCol}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Account details</h3>
            <dl className={styles.detailList}>
              {details.map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className={styles.detailRow}>
                  <dt className={styles.detailLabel}>
                    <Icon size={15} strokeWidth={2} aria-hidden="true" />
                    {label}
                  </dt>
                  <dd
                    className={[styles.detailValue, mono ? styles.mono : '']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Access &amp; permissions</h3>
            <p className={styles.cardSub}>
              Areas you can open with the {role} role.
            </p>
            <ul className={styles.accessList}>
              {accessItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className={styles.accessItem}>
                    <span className={styles.accessIcon} aria-hidden="true">
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    {item.label}
                  </li>
                )
              })}
            </ul>
            <p className={styles.note}>
              Profile details and access are managed by your administrator.
              Contact them to update your name, role, or store access.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
