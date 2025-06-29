import React from 'react'
import { cn } from "@/lib/utils"
import { LoadingInline } from './loading'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, loadingText = 'Loading...', children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            'bg-black text-white hover:bg-gray-900': variant === 'default',
            'border border-gray-200 bg-white hover:bg-gray-100': variant === 'outline',
            'hover:bg-gray-100': variant === 'ghost',
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3': size === 'sm',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingInline text={loadingText} />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button