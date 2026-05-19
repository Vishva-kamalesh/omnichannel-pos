import type { ReactNode } from 'react'
import styles from './DashboardPanel.module.css'

type DashboardPanelProps = {
  title: string
  meta?: string
  actions?: ReactNode
  children: ReactNode
  noPadding?: boolean
}

export function DashboardPanel({
  title,
  meta,
  actions,
  children,
  noPadding = false,
}: DashboardPanelProps) {
  const bodyClass = noPadding ? styles.bodyFlush : styles.body

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>
      <div className={bodyClass}>{children}</div>
    </section>
  )
}
