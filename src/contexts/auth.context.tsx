import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { createContext } from '@/utils/create-context'
import { useAsyncMount } from '@/hooks/use-async-mount'
import { attempt } from '@/utils/http'
import { useAsyncEffect } from '@/hooks/use-async-effect'
import { reduceToMapByField } from '@/utils/reduce-utils'
import { IUserVote } from '@/types/user-vote'

// eslint-disable-next-line
export const [useAuthContext, AuthContextProvider] = createContext<{
  user: User | null
  votes: Record<string, IUserVote>
  setVotes: Dispatch<SetStateAction<Record<string, IUserVote>>>
}>()

export function AuthProvider({ children }: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [votes, setVotes] = useState<Record<string, IUserVote>>({})

  useAsyncMount(async () => {
    const res = await attempt(supabase.auth.getUser())
    if (res?.data) setUser(res.data.user)
  })

  useAsyncEffect(async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_votes')
      .select('*')
      .eq('user_id', user.id)
    setVotes(reduceToMapByField(data as IUserVote[], 'game_id'))
  }, [user])

  return (
    <AuthContextProvider value={{ user, votes, setVotes }}>
      {children}
    </AuthContextProvider>
  )
}