/**
 * EventGroupItem model
 * Represents a relationship between an event group and an event
 */
import { v4 as uuidv4 } from 'uuid';

export class EventGroupItem {
    readonly uuid: string;
    readonly eventGroupId: string;
    readonly eventId: string;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        eventGroupId: string,
        eventId: string,
        position: number,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.eventGroupId = eventGroupId;
        this.eventId = eventId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new EventGroupItem with updated properties
     */
    update(updates: Partial<Omit<EventGroupItem, 'uuid'>>): EventGroupItem {
        return new EventGroupItem(
            updates.eventGroupId ?? this.eventGroupId,
            updates.eventId ?? this.eventId,
            updates.position ?? this.position,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            eventGroupId: this.eventGroupId,
            eventId: this.eventId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates an EventGroupItem instance from JSON data
     */
    static fromJSON(json: any): EventGroupItem {
        return new EventGroupItem(
            json.eventGroupId,
            json.eventId,
            json.position,
            json.metadata || {}
        );
    }
}