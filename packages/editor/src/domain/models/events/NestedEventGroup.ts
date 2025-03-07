import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a nested hierarchy of event groups
 * Used to create complex sequences of events with parent-child relationships
 */
export class NestedEventGroup {
    readonly uuid: string;
    readonly parentGroupId: string;
    readonly childGroupId: string;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        parentGroupId: string,
        childGroupId: string,
        position: number = 0,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.parentGroupId = parentGroupId;
        this.childGroupId = childGroupId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Creates a new NestedEventGroup with updated properties
     * @param updates Object containing property updates
     * @returns A new NestedEventGroup with updated properties
     */
    update(updates: Partial<Omit<NestedEventGroup, 'uuid'>>): NestedEventGroup {
        return new NestedEventGroup(
            updates.parentGroupId ?? this.parentGroupId,
            updates.childGroupId ?? this.childGroupId,
            updates.position ?? this.position,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Serializes the object to JSON
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            parentGroupId: this.parentGroupId,
            childGroupId: this.childGroupId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates a NestedEventGroup from a JSON object
     */
    static fromJSON(json: any): NestedEventGroup {
        return new NestedEventGroup(
            json.parentGroupId,
            json.childGroupId,
            json.position,
            json.metadata || {}
        );
    }
}