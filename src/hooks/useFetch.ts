// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react'

interface State<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string, deps: any[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null })

  const fetch_ = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setState({ data, loading: false, error: null })
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message || 'Erro ao carregar' })
    }
  }, [url])

  useEffect(() => { fetch_() }, [fetch_, ...deps])

  return { ...state, refetch: fetch_ }
}
