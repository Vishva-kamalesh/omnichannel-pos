import type { ReactNode } from 'react'
import styles from './AsyncBoundary.module.css'

type AsyncBoundaryProps = {
  loading: boolean
  error: string | null
  /** HTTP status of the failed request, when known. A 403 renders an access-restricted notice. */
  status?: number | null
  isEmpty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: ReactNode
}

// A 403 means the server understood the request but the user's role isn't
// permitted. Retrying won't help, so we show a distinct, non-alarming notice.
// Fall back to message matching for callers that don't thread the status code.
function isPermissionError(status: number | null | undefined, error: string) {
  return status === 403 || /is not authorized to access this route/i.test(error)
}

export function AsyncBoundary({
  loading,
  error,
  status,
  isEmpty,
  emptyMessage = 'Nothing to display yet.',
  onRetry,
  children,
}: AsyncBoundaryProps) {
  if (loading) {
    return (
      <div className={styles.state}>
        <span className={styles.spinner} aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    if (isPermissionError(status, error)) {
      return (
        <div className={styles.state}>
          <p className={styles.emptyTitle}>🔒 Access restricted</p>
          <p className={styles.errorBody}>
            You don’t have permission to view this section. It’s limited to users
            with the required role. If you believe this is a mistake, contact your
            administrator.
          </p>
        </div>
      )
    }

    return (
      <div className={styles.state}>
        <p className={styles.errorTitle}>Could not load data</p>
        <p className={styles.errorBody}>{error}</p>
        {onRetry ? (
          <button type="button" className={styles.retryBtn} onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={styles.state}>
        <p className={styles.emptyTitle}>{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}
