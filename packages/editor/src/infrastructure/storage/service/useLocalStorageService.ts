import { useState } from 'react';

export function useLocalStorageService() {
    const [error, setError] = useState<Error | null>(null);

    /**
     * Get an item from local storage
     */
    const getItem = <T>(key: string, defaultValue?: T): T | null => {
        try {
            const item = localStorage.getItem(key);

            if (item === null) {
                return defaultValue ?? null;
            }

            return JSON.parse(item);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to get item from local storage'));
            return defaultValue ?? null;
        }
    };

    /**
     * Set an item in local storage
     */
    const setItem = <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to set item in local storage'));
        }
    };

    /**
     * Remove an item from local storage
     */
    const removeItem = (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to remove item from local storage'));
        }
    };

    /**
     * Clear all items from local storage
     */
    const clear = (): void => {
        try {
            localStorage.clear();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to clear local storage'));
        }
    };

    /**
     * Check if an item exists in local storage
     */
    const hasItem = (key: string): boolean => {
        try {
            return localStorage.getItem(key) !== null;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to check item in local storage'));
            return false;
        }
    };

    return {
        getItem,
        setItem,
        removeItem,
        clear,
        hasItem,
        error
    };
}