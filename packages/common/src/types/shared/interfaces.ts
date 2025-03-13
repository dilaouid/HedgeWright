/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Asset {
    path: string;
    metadata?: {
        displayName?: string; // Optional user-friendly name
        category?: string; // Optional user categorization
        [key: string]: any; // Other custom metadata
    };
}