import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

// Composant pour les scanlines
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 rounded-md">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

const AceTabs = TabsPrimitive.Root;

const AceTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative inline-flex h-12 items-center justify-center rounded-md bg-[#1F1E36] border-2 border-[#F0B27A] p-1 text-white",
      className
    )}
    {...props}
  >
    {props.children}
    <Scanlines />
  </TabsPrimitive.List>
));
AceTabsList.displayName = TabsPrimitive.List.displayName;

const AceTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: 'red' | 'blue' | 'green' | 'purple';
  }
>(({ className, variant = 'red', ...props }, ref) => {
  const variantClasses = {
    red: "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#FF5722] data-[state=active]:to-[#D32F2F]",
    blue: "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#2196F3] data-[state=active]:to-[#1565C0]",
    green: "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#4CAF50] data-[state=active]:to-[#2E7D32]",
    purple: "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#9C27B0] data-[state=active]:to-[#6A1B9A]",
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-2 data-[state=active]:border-white",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {props.children}
      <Scanlines />
    </TabsPrimitive.Trigger>
  );
});
AceTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const AceTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
AceTabsContent.displayName = TabsPrimitive.Content.displayName;

export { AceTabs, AceTabsList, AceTabsTrigger, AceTabsContent }; 