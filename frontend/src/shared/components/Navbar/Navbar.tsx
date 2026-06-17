import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_STORE_NAME, MAIN_NAVIGATION, ROUTES } from '@/shared/constants'
import { useUIStore } from '@/app/store'
import { useAuthStore } from '@/features/auth'
import { avatarFallback, avatarImage } from '@/shared/utils/images'
import styles from './Navbar.module.css'

function getPageTitle(pathname: string): string {
  for (const section of MAIN_NAVIGATION) {
    const match = section.items.find((item) => {
      if (item.path === '/') return pathname === '/'
      return pathname.startsWith(item.path)
    })
    if (match) return match.label
  }
  return 'Dashboard'
}

function formatRole(role?: string): string {
  if (!role) return 'Team Member'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const pageTitle = getPageTitle(location.pathname)

  const displayName = user?.name ?? 'Guest User'
  const displayRole = formatRole(user?.role)
  const avatarSeed = user?.email ?? displayName

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={toggleMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.storeName}>{DEFAULT_STORE_NAME}</p>
        </div>
      </div>

      <div className={styles.center}>
        <label className={styles.search} htmlFor="global-search">
          <Search size={16} strokeWidth={1.75} aria-hidden="true" />
          <input
            id="global-search"
            type="search"
            placeholder="Search orders, products, SKU..."
            className={styles.searchInput}
          />
          <kbd className={styles.searchShortcut} aria-hidden="true">
            ⌘K
          </kbd>
        </label>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.75} />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={styles.userBtn}
          aria-label="View profile"
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          <img
            className={styles.avatarImg}
            src={avatarImage(avatarSeed, 52)}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              // Photo failed → swap to an illustrated avatar (never initials).
              const img = e.currentTarget
              if (img.dataset.fallback) return
              img.dataset.fallback = '1'
              img.src = avatarFallback(avatarSeed)
            }}
          />
          <span className={styles.userMeta}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userRole}>{displayRole}</span>
          </span>
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Sign out"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={18} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
