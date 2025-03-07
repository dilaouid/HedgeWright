import * as React from "react"
import { cn } from "@lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div 
        ref={ref} 
        className="h-full w-full rounded-[inherit] pixelated-scrollbar overflow-auto"
      >
        {children}
      </div>
    </div>
  )
)

ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
export type { ScrollAreaProps } 