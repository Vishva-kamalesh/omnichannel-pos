import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/types/navigation'
import { useUIStore } from '@/app/store'
import styles from './SidebarNavItem.module.css'

type SidebarNavItemProps = {
  item: NavItem
  collapsed: boolean
}

export function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar)
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')
      }
      title={collapsed ? item.label : undefined}
      onClick={closeMobileSidebar}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {!collapsed && <span className={styles.label}>{item.label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span className={styles.badge}>{item.badge}</span>
      )}
    </NavLink>
  )
}
