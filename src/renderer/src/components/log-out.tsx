import { removeSession } from '@renderer/actions'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export default function LogOut({ className }: { className?: string }) {
  const navigate = useNavigate()
  const handleClearSession = () => {
    removeSession()
    navigate('/auth/login')
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={handleClearSession}
          className={cn(' hover:bg-transparent p-1  group relative', className)}
        >
          <LogOutIcon className="size-4 opacity-80 group-hover:opacity-100" />
          <div className="absolute size-2 bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-50 blur-sm -z-[1]"></div>
          <div className="absolute size-3 bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-50 blur-md -z-[1]"></div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Log out</span>
      </TooltipContent>
    </Tooltip>
  )
}
