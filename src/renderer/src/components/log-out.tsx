import { removeSession } from '@renderer/actions'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'

export default function LogOut() {
  const navigate = useNavigate()
  const handleClearSession = () => {
    removeSession()
    navigate('/auth/login')
  }

  return (
    <Button size={'icon'} onClick={handleClearSession}>
      <LogOut />
    </Button>
  )
}
