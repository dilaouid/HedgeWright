/**
 * BubbleSet model
 * Represents a collection of reaction bubbles for a specific character or context
 */
import { v4 as uuidv4 } from 'uuid';

export class BubbleSet {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly metadata: Record<string, unknown>;

    constructor(
        customId: string,
        name: string,
        metadata: Record<string, unknown> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.metadata = metadata;
    }

    /**
     * Returns a new BubbleSet with updated properties
     */
    update(updates: Partial<Omit<BubbleSet, 'uuid'>>): BubbleSet {
        return new BubbleSet(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.metadata ?? this.metadata
        );
    }

    /**
   * Converts to a JSON-serializable format
   */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            metadata: this.metadata
        };
    }

    /**
         * Creates a BubbleSet instance from JSON data
         */
        static fromJSON(json: {
            customId: string;
            name: string;
            metadata?: Record<string, unknown>;
        }): BubbleSet {
            return new BubbleSet(
                json.customId,
                json.name,
                json.metadata || {}
            );
        }
}