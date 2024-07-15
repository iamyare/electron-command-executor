import ButtonGhost from '@renderer/components/ui/button-ghost'
import { TooltipProvider } from './ui/tooltip'
import { removeSession } from '@renderer/actions'
import { useNavigate } from 'react-router-dom'
import { LogOutIcon } from 'lucide-react'

export default function HeaderNavbar() {
  const navigate = useNavigate()
  const handleClearSession = () => {
    removeSession()
    navigate('/auth/login')
  }
  return (
    <header id="titlebar" className="fixed top-0 left-0 w-screen p-4">
      <TooltipProvider delayDuration={300}>
        <ButtonGhost icon={LogOutIcon} tooltip="Cerrar Sesion" onClick={handleClearSession} />
        {/* <button onClick={getInfoDeviceFunction}>Get Info Device</button> */}
      </TooltipProvider>
    </header>
  )
}
