'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RealismButtonProps {
  children?: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function RealismButton({ children = 'Realism', onClick, className, disabled }: RealismButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative cursor-pointer rounded-full border-none p-[1.5px] text-[1rem] transform-gpu",
        "bg-[radial-gradient(circle_60px_at_80%_-10%,#ffffff,#181b1b)]",
        "transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99]",
        "hover:shadow-[0_8px_30px_rgba(0,81,255,0.12)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div
        className="absolute left-0 bottom-0 h-full w-[50px] rounded-full
                   bg-[radial-gradient(circle_40px_at_0%_100%,#3fe9ff,#0000ff80,transparent)]
                   shadow-[-8px_8px_20px_#0051ff1a]"
      />

      <div
        className="relative z-[3] rounded-full px-[18px] py-[10px] text-white font-medium
                   bg-[radial-gradient(circle_60px_at_80%_-50%,#777777,#0f1111)]"
      >
        <span className="absolute left-0 top-0 h-full w-full rounded-full
                         bg-[radial-gradient(circle_40px_at_0%_100%,#00e1ff1a,#0000ff11,transparent)]" />
        <span className="relative">{children}</span>
      </div>

      <div
        className="absolute top-0 right-0 z-[-1] h-[50%] w-[55%] rounded-[80px]
                   shadow-[0_0_15px_#ffffff25]"
      />
    </button>
  )
} 