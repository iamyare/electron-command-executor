import { Button } from './button'
import { cn } from '@renderer/lib/utils'
import { ComponentProps, ForwardRefExoticComponent, RefAttributes } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'

// Definición ajustada para icon, permitiendo componentes que acepten className.
interface ButtonGhostProps extends ComponentProps<typeof Button> {
  classNameIcon?: string
  tooltip: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ForwardRefExoticComponent<Omit<any, 'ref'> & RefAttributes<SVGSVGElement>> & {
    className?: string
  }
}

export default function ButtonGhost({
  className,
  icon: Icon,
  classNameIcon,
  tooltip,
  ...buttonProps
}: ButtonGhostProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...buttonProps}
          variant={'ghost'}
          className={cn(
            'hover:bg-transparent p-1 group relative transition-transform active:scale-95',
            className
          )}
        >
          {/* Uso de Icon con className, ahora es válido según la nueva definición de icon en ButtonGhostProps */}
          <Icon className={cn('size-4 opacity-80 group-hover:opacity-100', classNameIcon)} />
          <div className="absolute size-2 bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-50 blur-sm -z-[1]"></div>
          <div className="absolute size-3 bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-50 blur-md -z-[1]"></div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  )
}
