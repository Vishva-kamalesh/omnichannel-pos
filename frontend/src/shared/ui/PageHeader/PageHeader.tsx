import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

type PageHeaderProps = {
  title: string
  description?: string
  /** Render the description as monospace operational metadata (date, scope, currency). */
  descriptionMono?: boolean
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  descriptionMono,
  actions,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        {description ? (
          <p
            className={[
              styles.description,
              descriptionMono ? styles.descriptionMono : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  )
}
