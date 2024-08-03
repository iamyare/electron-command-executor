import ButtonGhost from '@renderer/components/ui/button-ghost'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { removeSession } from '@renderer/actions'
import { useNavigate } from 'react-router-dom'
import { LogOutIcon, Settings, Minus } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const handleClearSession = () => {
    removeSession()
    navigate('/auth/login')
  }

  const handleMinimize = () => {
    window.api.minimizeApp()
  }

  return (
    <header id="titlebar" className="fixed top-0 left-0 w-screen p-4">
      <TooltipProvider delayDuration={300}>
        <ButtonGhost icon={LogOutIcon} tooltip="Cerrar Sesion" onClick={handleClearSession} />
        <ButtonGhost
          icon={Settings}
          tooltip="Configuracion"
          onClick={() => console.log('Abre modal config')}
        />
        <ButtonGhost
          icon={Minus}
          tooltip="Minimizar"
          className="fixed top-0 right-2"
          onClick={handleMinimize}
        />
      </TooltipProvider>
    </header>
  )
}
