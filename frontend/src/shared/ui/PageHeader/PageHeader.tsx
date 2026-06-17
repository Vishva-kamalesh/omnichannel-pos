import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

type PageHeaderProps = {
  title: string
  description?: string
  /** Render the description as monospace operational metadata (date, scope, currency). */
  descriptionMono?: boolean
  /** Render the title in solid white for dark-themed surfaces (e.g. the dashboard). */
  light?: boolean
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  descriptionMono,
  light,
  actions,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h2
          className={[styles.title, light ? styles.titleLight : '']
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={[
              styles.description,
              descriptionMono ? styles.descriptionMono : '',
              light ? styles.descriptionLight : '',
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
