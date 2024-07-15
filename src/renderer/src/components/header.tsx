import LogOut from './log-out'
import { TooltipProvider } from './ui/tooltip'

export default function HeaderNavbar() {
  return (
    <header id="titlebar" className="fixed top-0 left-0 w-screen p-4">
      <TooltipProvider delayDuration={300}>
        <LogOut />
        {/* <button onClick={getInfoDeviceFunction}>Get Info Device</button> */}
      </TooltipProvider>
    </header>
  )
}
