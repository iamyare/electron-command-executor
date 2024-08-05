import { supabase } from '@renderer/actions/supabase'
import { Button } from './ui/button'

export const OAuthButtons = () => {
  ;() => {
    const handleSignIn = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google'
      })
    }

    return <Button onClick={handleSignIn}>Google</Button>
  }
}
