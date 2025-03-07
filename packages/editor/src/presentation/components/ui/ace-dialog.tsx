import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Composant pour les scanlines
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 rounded-md">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

const AceDialog = DialogPrimitive.Root;
const AceDialogTrigger = DialogPrimitive.Trigger;
const AceDialogPortal = DialogPrimitive.Portal;
const AceDialogClose = DialogPrimitive.Close;

const AceDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
AceDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const AceDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AceDialogPortal>
    <AceDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full bg-gradient-to-b from-[#D32F2F] to-[#B71C1C] relative",
        className
      )}
      {...props}
    >
      {children}
      <Scanlines />
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-6 w-6 text-white" />
        <span className="sr-only">Fermer</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </AceDialogPortal>
));
AceDialogContent.displayName = DialogPrimitive.Content.displayName;

const AceDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left border-b-2 border-white pb-3 mb-3",
      className
    )}
    {...props}
  />
);
AceDialogHeader.displayName = "AceDialogHeader";

const AceDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t-2 border-white pt-3 mt-3",
      className
    )}
    {...props}
  />
);
AceDialogFooter.displayName = "AceDialogFooter";

const AceDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-bold text-white", className)}
    {...props}
  />
));
AceDialogTitle.displayName = DialogPrimitive.Title.displayName;

const AceDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-white/90", className)}
    {...props}
  />
));
AceDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  AceDialog,
  AceDialogTrigger,
  AceDialogContent,
  AceDialogHeader,
  AceDialogFooter,
  AceDialogTitle,
  AceDialogDescription,
  AceDialogClose,
}; 