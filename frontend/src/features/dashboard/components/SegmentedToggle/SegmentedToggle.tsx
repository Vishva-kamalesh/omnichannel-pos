import styles from './SegmentedToggle.module.css'

type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type SegmentedToggleProps<T extends string> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedToggleProps<T>) {
  return (
    <div className={styles.toggle} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            className={[styles.option, isActive ? styles.active : ''].join(' ')}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
