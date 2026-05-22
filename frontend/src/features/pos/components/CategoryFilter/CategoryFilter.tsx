import type { ProductCategory } from '../../types/pos.types'
import styles from './CategoryFilter.module.css'

export type CategoryId = 'all' | ProductCategory

export type CategoryOption = {
  id: CategoryId
  label: string
  count: number
  accent?: string
}

type CategoryFilterProps = {
  options: CategoryOption[]
  active: CategoryId
  onChange: (id: CategoryId) => void
  resultCount: number
}

export function CategoryFilter({
  options,
  active,
  onChange,
  resultCount,
}: CategoryFilterProps) {
  return (
    <div className={styles.wrap}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Filter products by category"
      >
        {options.map((option) => {
          const isActive = option.id === active
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={[styles.tab, isActive ? styles.tabActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(option.id)}
            >
              {option.accent ? (
                <span
                  className={styles.dot}
                  style={{ backgroundColor: option.accent }}
                  aria-hidden="true"
                />
              ) : null}
              <span>{option.label}</span>
              <span className={styles.count}>{option.count}</span>
            </button>
          )
        })}
      </div>
      <p className={styles.result}>
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </p>
    </div>
  )
}
