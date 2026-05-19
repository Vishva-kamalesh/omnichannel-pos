import { Outlet } from 'react-router-dom'
import { useUIStore } from '@/app/store'
import { Navbar } from '@/shared/components/Navbar'
import { Sidebar } from '@/shared/components/Sidebar'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)

  const shellClassName = [
    styles.shell,
    sidebarCollapsed ? styles.sidebarCollapsed : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClassName}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />
        <main className={styles.content} id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
