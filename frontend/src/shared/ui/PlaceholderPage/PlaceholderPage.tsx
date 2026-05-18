import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import styles from './PlaceholderPage.module.css'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageShell>
      <PageHeader title={title} description={description} />
      <div className={styles.card}>
        <p className={styles.message}>
          This module is ready for implementation. Build feature-specific
          components inside <code>features/{title.toLowerCase()}</code>.
        </p>
      </div>
    </PageShell>
  )
}
