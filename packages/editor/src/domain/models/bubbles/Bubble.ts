/**
 * Bubble model
 * Represents a reaction bubble (Objection!, Hold it!, etc.) with associated animation and sound
 */
import { BubbleType } from '@hedgewright/common';
import { v4 as uuidv4 } from 'uuid';

export class Bubble {
    readonly uuid: string;
    readonly customId: string;
    readonly bubbleSetId: string;
    readonly type: BubbleType;
    readonly name: string;
    readonly animation: string;
    readonly soundId: string;
    readonly metadata: Record<string, unknown>;

    constructor(
        customId: string,
        bubbleSetId: string,
        type: BubbleType,
        name: string,
        animation: string,
        soundId: string,
        metadata: Record<string, unknown> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.bubbleSetId = bubbleSetId;
        this.type = type;
        this.name = name;
        this.animation = animation;
        this.soundId = soundId;
        this.metadata = metadata;
    }

    /**
     * Returns a new Bubble with updated properties
     */
    update(updates: Partial<Omit<Bubble, 'uuid'>>): Bubble {
        return new Bubble(
            updates.customId ?? this.customId,
            updates.bubbleSetId ?? this.bubbleSetId,
            updates.type ?? this.type,
            updates.name ?? this.name,
            updates.animation ?? this.animation,
            updates.soundId ?? this.soundId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this is a standard objection bubble
     */
    isObjection(): boolean {
        return this.type === BubbleType.OBJECTION;
    }

    /**
     * Checks if this is a hold it bubble
     */
    isHoldIt(): boolean {
        return this.type === BubbleType.HOLD_IT;
    }

    /**
     * Checks if this is a take that bubble
     */
    isTakeThat(): boolean {
        return this.type === BubbleType.TAKE_THAT;
    }

    /**
     * Checks if this is a custom bubble type
     */
    isCustom(): boolean {
        return this.type === BubbleType.CUSTOM;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            bubbleSetId: this.bubbleSetId,
            type: this.type,
            name: this.name,
            animation: this.animation,
            soundId: this.soundId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Bubble instance from JSON data
     */
    static fromJSON(json: {
        customId: string;
        bubbleSetId: string;
        type: BubbleType;
        name: string;
        animation: string;
        soundId: string;
        metadata?: Record<string, unknown>;
    }): Bubble {
        return new Bubble(
            json.customId,
            json.bubbleSetId,
            json.type,
            json.name,
            json.animation,
            json.soundId,
            json.metadata || {}
        );
    }
}