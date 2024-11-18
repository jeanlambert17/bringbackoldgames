import { DependencyList, useEffect, useState } from 'react'

export function useAsyncEffect(callback: () => Promise<void>, deps: DependencyList = []) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        await callback()
        setLoading(false)
      } catch (err) {
        console.error('Use async effect error:', err)
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return loading
}
