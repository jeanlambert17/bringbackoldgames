import { useEffect, useState } from 'react'

export function useAsyncMount(callback: () => Promise<void>) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        await callback()
        setLoading(false)
      } catch (err) {
        console.error('Use async mount error:', err)
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return loading
}
