import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Définition des variantes de boutons avec une approche systématique
 * Utilise cva pour une gestion cohérente des styles
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#FF5722] to-[#D32F2F] text-white border-2 border-white shadow-md",
        blue: "bg-gradient-to-b from-[#2196F3] to-[#1565C0] text-white border-2 border-white shadow-md",
        green: "bg-gradient-to-b from-[#4CAF50] to-[#2E7D32] text-white border-2 border-white shadow-md",
        purple: "bg-gradient-to-b from-[#9C27B0] to-[#6A1B9A] text-white border-2 border-white shadow-md",
        orange: "bg-gradient-to-b from-[#FF9800] to-[#F57C00] text-white border-2 border-white shadow-md",
        outline: "border-2 border-white bg-transparent text-white hover:bg-white/10",
        ghost: "bg-transparent text-white hover:bg-white/10 border-0",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "pulse-animation",
        shine: "shine-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "shine",
    },
  }
);

// Composant pour les scanlines
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

export interface AceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

/**
 * Bouton principal avec style Ace Attorney
 * Supporte plusieurs variantes, tailles et animations
 */
const AceButton = React.forwardRef<HTMLButtonElement, AceButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    icon, 
    iconPosition = 'left',
    loading = false,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          
          {icon && iconPosition === 'left' && !loading && (
            <span className="mr-1">{icon}</span>
          )}
          
          {children}
          
          {icon && iconPosition === 'right' && (
            <span className="ml-1">{icon}</span>
          )}
        </span>
        
        <Scanlines />
        
        {/* Effet de brillance sur hover pour les boutons avec animation shine */}
        {animation === 'shine' && (
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        )}
      </Comp>
    );
  }
);

AceButton.displayName = "AceButton";

export { AceButton, buttonVariants }; 