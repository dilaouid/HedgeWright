/**
 * Investigation model
 * Represents a collection of scenes that form an investigation section
 */
import { v4 as uuidv4 } from 'uuid';

export class Investigation {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly description: string | null;
    readonly position: number;
    readonly switchConditionId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        position: number,
        description: string | null = null,
        switchConditionId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.description = description;
        this.position = position;
        this.switchConditionId = switchConditionId;
        this.metadata = metadata;
    }

    /**
     * Returns a new Investigation with updated properties
     */
    update(updates: Partial<Omit<Investigation, 'uuid'>>): Investigation {
        return new Investigation(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.position ?? this.position,
            updates.description ?? this.description,
            updates.switchConditionId ?? this.switchConditionId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this investigation has a switch condition
     */
    hasSwitchCondition(): boolean {
        return this.switchConditionId !== null;
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
            position: this.position,
            switchConditionId: this.switchConditionId,
            metadata: this.metadata
        };
    }

    /**
     * Creates an Investigation instance from JSON data
     */
    static fromJSON(json: any): Investigation {
        return new Investigation(
            json.customId,
            json.name,
            json.position,
            json.description,
            json.switchConditionId,
            json.metadata || {}
        );
    }
}