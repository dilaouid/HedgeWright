import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "relative rounded-md shadow-md overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#1F1E36] border-2 border-[#F0B27A]",
        red: "bg-gradient-to-b from-[#D32F2F] to-[#B71C1C] border-2 border-white",
        blue: "bg-gradient-to-b from-[#1565C0] to-[#0D47A1] border-2 border-white",
        evidence: "bg-[#2C2B4B] border-2 border-[#F0B27A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Composant pour les scanlines
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

export interface AceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const AceCard = React.forwardRef<HTMLDivElement, AceCardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        <Scanlines />
      </div>
    );
  }
);

AceCard.displayName = "AceCard";

// Sous-composants pour la carte
const AceCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 font-bold border-b-2 border-[#F0B27A]", className)}
    {...props}
  />
));
AceCardHeader.displayName = "AceCardHeader";

const AceCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold text-white", className)}
    {...props}
  />
));
AceCardTitle.displayName = "AceCardTitle";

const AceCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 text-white", className)} {...props} />
));
AceCardContent.displayName = "AceCardContent";

const AceCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t-2 border-[#F0B27A] bg-[#1F1E36]", className)}
    {...props}
  />
));
AceCardFooter.displayName = "AceCardFooter";

export { AceCard, AceCardHeader, AceCardTitle, AceCardContent, AceCardFooter }; 