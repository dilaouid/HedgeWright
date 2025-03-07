import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

/**
 * Hook for displaying toast notifications
 */
export function useToast() {
    /**
     * Show a success toast
     */
    const success = useCallback((message: string) => {
        sonnerToast.success(message);
    }, []);

    /**
     * Show an error toast
     */
    const error = useCallback((message: string) => {
        sonnerToast.error(message);
    }, []);

    /**
     * Show an info toast
     */
    const info = useCallback((message: string) => {
        sonnerToast.info(message);
    }, []);

    /**
     * Show a warning toast
     */
    const warning = useCallback((message: string) => {
        sonnerToast.warning(message);
    }, []);

    /**
     * Show a custom toast
     */
    const custom = useCallback(
        (props: {
            title?: string;
            description?: string;
            icon?: React.ReactNode;
            duration?: number;
            action?: {
                label: string;
                onClick: () => void;
            };
        }) => {
            sonnerToast(props.title || '', {
                description: props.description,
                icon: props.icon,
                duration: props.duration,
                action: props.action
                    ? {
                        label: props.action.label,
                        onClick: props.action.onClick,
                    }
                    : undefined,
            });
        },
        []
    );

    /**
     * Dismiss all toasts
     */
    const dismiss = useCallback(() => {
        sonnerToast.dismiss();
    }, []);

    return {
        success,
        error,
        info,
        warning,
        custom,
        dismiss,
    };
}