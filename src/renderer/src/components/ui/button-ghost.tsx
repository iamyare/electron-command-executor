import { Button } from './button'
import { cn } from '@renderer/lib/utils'
import React, { ReactElement, ComponentProps } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'

interface ButtonGhostProps extends ComponentProps<typeof Button> {
  classNameIcon?: string
  tooltip: string
  icon: ReactElement
}

export default function ButtonGhost({
  className,
  icon,
  classNameIcon,
  tooltip,
  ...buttonProps
}: ButtonGhostProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...buttonProps}
          className={cn('hover:bg-transparent p-1 group relative', className)}
        >
          {React.cloneElement(icon, {
            className: cn('size-4 opacity-80 group-hover:opacity-100', classNameIcon)
          })}
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
