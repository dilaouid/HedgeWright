/**
 * Event model
 * Represents a game event that triggers various effects
 */
import { v4 as uuidv4 } from 'uuid';
import { EventType } from '@hedgewright/common';

export class Event {
    readonly uuid: string;
    readonly customId: string;
    readonly type: EventType;
    readonly value: string | null;
    readonly duration: number | null;
    readonly targetId: string | null;
    readonly switchId: string | null;
    readonly healAmount: number | null;
    readonly damageAmount: number | null;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        type: EventType,
        position: number,
        value: string | null = null,
        duration: number | null = null,
        targetId: string | null = null,
        switchId: string | null = null,
        healAmount: number | null = null,
        damageAmount: number | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.type = type;
        this.value = value;
        this.duration = duration;
        this.targetId = targetId;
        this.switchId = switchId;
        this.healAmount = healAmount;
        this.damageAmount = damageAmount;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new Event with updated properties
     */
    update(updates: Partial<Omit<Event, 'uuid'>>): Event {
        return new Event(
            updates.customId ?? this.customId,
            updates.type ?? this.type,
            updates.position ?? this.position,
            updates.value ?? this.value,
            updates.duration ?? this.duration,
            updates.targetId ?? this.targetId,
            updates.switchId ?? this.switchId,
            updates.healAmount ?? this.healAmount,
            updates.damageAmount ?? this.damageAmount,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this event has a duration
     */
    hasDuration(): boolean {
        return this.duration !== null;
    }

    /**
     * Checks if this event has a specific target
     */
    hasTarget(): boolean {
        return this.targetId !== null;
    }

    /**
     * Checks if this event affects a switch
     */
    affectsSwitch(): boolean {
        return this.switchId !== null;
    }

    /**
     * Checks if this event affects health
     */
    affectsHealth(): boolean {
        return this.healAmount !== null || this.damageAmount !== null;
    }

    /**
     * Checks if this is a wait/delay event
     */
    isWaitEvent(): boolean {
        return this.type === EventType.WAIT;
    }

    /**
     * Checks if this is a music event
     */
    isMusicEvent(): boolean {
        return [
            EventType.PLAY_MUSIC,
            EventType.STOP_MUSIC,
            EventType.PAUSE_MUSIC,
            EventType.RESUME_MUSIC,
            EventType.PLAY_AMBIENT
        ].includes(this.type);
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            type: this.type,
            value: this.value,
            duration: this.duration,
            targetId: this.targetId,
            switchId: this.switchId,
            healAmount: this.healAmount,
            damageAmount: this.damageAmount,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates an Event instance from JSON data
     */
    static fromJSON(json: any): Event {
        return new Event(
            json.customId,
            json.type,
            json.position,
            json.value,
            json.duration,
            json.targetId,
            json.switchId,
            json.healAmount,
            json.damageAmount,
            json.metadata || {}
        );
    }
}