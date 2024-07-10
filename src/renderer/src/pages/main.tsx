import { removeSession } from '@renderer/actions'
import { Button } from '@renderer/components/ui/button'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MainPage() {
  const navigate = useNavigate()
  const handleClearSession = () => {
    removeSession()
    navigate('/auth/login')
  }

  return (
    <main className="flex w-screen h-screen justify-center items-center">
      <header className=" fixed flex justify-between top-0 left-0 w-screen p-4">
        <Button size={'icon'} onClick={handleClearSession}>
          <LogOut />
        </Button>
      </header>
      <h1>Main Page</h1>
    </main>
  )
}
