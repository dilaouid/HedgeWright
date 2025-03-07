/**
 * Switch model
 * Represents a boolean flag that can control game behavior and interactions
 */
import { v4 as uuidv4 } from 'uuid';

export class Switch {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly numericId: number;
    readonly description: string | null;
    readonly initialValue: boolean;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        numericId: number,
        description: string | null = null,
        initialValue: boolean = false,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.numericId = numericId;
        this.description = description;
        this.initialValue = initialValue;
        this.metadata = metadata;
    }

    /**
     * Returns a new Switch with updated properties
     */
    update(updates: Partial<Omit<Switch, 'uuid'>>): Switch {
        return new Switch(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.numericId ?? this.numericId,
            updates.description ?? this.description,
            updates.initialValue ?? this.initialValue,
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
            numericId: this.numericId,
            description: this.description,
            initialValue: this.initialValue,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Switch instance from JSON data
     */
    static fromJSON(json: any): Switch {
        return new Switch(
            json.customId,
            json.name,
            json.numericId,
            json.description,
            json.initialValue,
            json.metadata || {}
        );
    }
}