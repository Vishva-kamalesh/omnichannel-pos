import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

type AsyncState<T> = {
  data: T | null
  error: string | null
  /** HTTP status code of a failed request, when available (e.g. 403 for permission errors). */
  status: number | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
      const result = await fnRef.current()
      setData(result)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus(err.response?.status ?? null)
        setError(
          (err.response?.data as { message?: string } | undefined)?.message ??
            err.message ??
            'Request failed',
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void run()
  }, deps)

  return { data, error, status, loading, refetch: run }
}
