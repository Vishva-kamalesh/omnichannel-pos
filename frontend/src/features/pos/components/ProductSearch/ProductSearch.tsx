import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ScanBarcode, Search, X } from 'lucide-react'
import type { ScanResult } from '../../types/pos.types'
import styles from './ProductSearch.module.css'

type ProductSearchProps = {
  query: string
  onQueryChange: (value: string) => void
  /** Resolves a scanned/typed code and reports whether it was added. */
  onBarcodeSubmit: (code: string) => ScanResult
}

type Feedback = { tone: 'ok' | 'error'; message: string }

export function ProductSearch({
  query,
  onQueryChange,
  onBarcodeSubmit,
}: ProductSearchProps) {
  const [barcode, setBarcode] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const barcodeRef = useRef<HTMLInputElement>(null)
  const feedbackTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    searchRef.current?.focus()
    return () => window.clearTimeout(feedbackTimer.current)
  }, [])

  // Cashier shortcuts: "/" jumps to search, "F2" to the barcode field.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement

      if (event.key === 'F2') {
        event.preventDefault()
        barcodeRef.current?.focus()
        barcodeRef.current?.select()
      } else if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  function flash(next: Feedback) {
    setFeedback(next)
    window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 2400)
  }

  function handleBarcodeSubmit(event: FormEvent) {
    event.preventDefault()
    const code = barcode.trim()
    if (!code) return
    const result = onBarcodeSubmit(code)
    if (result.status === 'added') {
      flash({ tone: 'ok', message: `Added ${result.product.name}` })
    } else if (result.status === 'out-of-stock') {
      flash({
        tone: 'error',
        message: `${result.product.name} — stock limit reached`,
      })
    } else {
      flash({ tone: 'error', message: `No product matches "${code}"` })
    }
    setBarcode('')
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchField}>
        <Search size={16} strokeWidth={2} aria-hidden="true" />
        <input
          ref={searchRef}
          type="text"
          className={styles.input}
          placeholder="Search products by name or SKU"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onQueryChange('')
          }}
          aria-label="Search products"
        />
        {query ? (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              onQueryChange('')
              searchRef.current?.focus()
            }}
            aria-label="Clear search"
          >
            <X size={14} strokeWidth={2.25} />
          </button>
        ) : (
          <kbd className={styles.kbd}>/</kbd>
        )}
      </div>

      <form className={styles.scanField} onSubmit={handleBarcodeSubmit}>
        <ScanBarcode size={16} strokeWidth={2} aria-hidden="true" />
        <input
          ref={barcodeRef}
          type="text"
          inputMode="numeric"
          className={styles.input}
          placeholder="Scan or enter barcode"
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          aria-label="Barcode entry"
        />
        <kbd className={styles.kbd}>F2</kbd>
      </form>

      {feedback ? (
        <p
          role="status"
          className={[
            styles.feedback,
            feedback.tone === 'ok' ? styles.feedbackOk : styles.feedbackError,
          ].join(' ')}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  )
}
