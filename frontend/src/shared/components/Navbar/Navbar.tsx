import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_STORE_NAME, MAIN_NAVIGATION } from '@/shared/constants'
import { useUIStore } from '@/app/store'
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

export function Navbar() {
  const location = useLocation()
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar)
  const pageTitle = getPageTitle(location.pathname)

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

        <button type="button" className={styles.userBtn} aria-label="Account menu">
          <span className={styles.avatar} aria-hidden="true">
            AK
          </span>
          <span className={styles.userMeta}>
            <span className={styles.userName}>Amit Kumar</span>
            <span className={styles.userRole}>Store Manager</span>
          </span>
          <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
