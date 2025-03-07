/**
 * Dialogue model
 * Represents a sequence of messages and choices
 */
import { v4 as uuidv4 } from 'uuid';

export class Dialogue {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly description: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        description: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.description = description;
        this.metadata = metadata;
    }

    /**
     * Returns a new Dialogue with updated properties
     */
    update(updates: Partial<Omit<Dialogue, 'uuid'>>): Dialogue {
        return new Dialogue(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.description ?? this.description,
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
            description: this.description,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Dialogue instance from JSON data
     */
    static fromJSON(json: any): Dialogue {
        return new Dialogue(
            json.customId,
            json.name,
            json.description,
            json.metadata || {}
        );
    }
}