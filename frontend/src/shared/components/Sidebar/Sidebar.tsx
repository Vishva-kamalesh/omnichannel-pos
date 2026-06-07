import { PanelLeftClose, PanelLeftOpen, ShoppingBag } from 'lucide-react'
import {
  APP_NAME,
  MAIN_NAVIGATION,
  filterNavigationByRole,
} from '@/shared/constants'
import { useAuthStore } from '@/features/auth'
import { useUIStore } from '@/app/store'
import { SidebarNavItem } from './SidebarNavItem'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar)
  const role = useAuthStore((s) => s.user?.role)

  const navigation = filterNavigationByRole(MAIN_NAVIGATION, role)

  const sidebarClassName = [
    styles.sidebar,
    sidebarCollapsed ? styles.collapsed : '',
    mobileSidebarOpen ? styles.mobileOpen : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {mobileSidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close navigation menu"
          onClick={closeMobileSidebar}
        />
      )}

      <aside className={sidebarClassName} aria-label="Main navigation">
        <div className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.logoMark} aria-hidden="true">
              <ShoppingBag size={18} strokeWidth={2} />
            </span>
            {!sidebarCollapsed && (
              <span className={styles.logoText}>{APP_NAME}</span>
            )}
          </div>
        </div>

        <nav className={styles.nav}>
          {navigation.map((section) => (
            <div key={section.id} className={styles.section}>
              {!sidebarCollapsed && section.title && (
                <p className={styles.sectionTitle}>{section.title}</p>
              )}
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <SidebarNavItem
                      item={item}
                      collapsed={sidebarCollapsed}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose size={18} strokeWidth={1.75} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
