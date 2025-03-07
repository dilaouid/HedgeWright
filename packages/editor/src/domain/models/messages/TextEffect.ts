/**
 * TextEffect model
 * Represents a visual or auditory effect applied to text
 */
import { TextEffectType } from '@hedgewright/common';
import { v4 as uuidv4 } from 'uuid';

export class TextEffect {
    readonly uuid: string;
    readonly textSegmentId: string;
    readonly type: TextEffectType;
    readonly value: string;
    readonly startDelay: number;
    readonly duration: number | null;
    readonly intensity: number | null;
    readonly metadata: Record<string, any>;

    constructor(
        textSegmentId: string,
        type: TextEffectType,
        value: string,
        startDelay: number = 0,
        duration: number | null = null,
        intensity: number | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.textSegmentId = textSegmentId;
        this.type = type;
        this.value = value;
        this.startDelay = startDelay;
        this.duration = duration;
        this.intensity = intensity;
        this.metadata = metadata;
    }

    /**
     * Returns a new TextEffect with updated properties
     */
    update(updates: Partial<Omit<TextEffect, 'uuid'>>): TextEffect {
        return new TextEffect(
            updates.textSegmentId ?? this.textSegmentId,
            updates.type ?? this.type,
            updates.value ?? this.value,
            updates.startDelay ?? this.startDelay,
            updates.duration ?? this.duration,
            updates.intensity ?? this.intensity,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this effect is time-based
     */
    isTimeBasedEffect(): boolean {
        return this.duration !== null;
    }

    /**
     * Checks if this effect has an intensity parameter
     */
    hasIntensity(): boolean {
        return this.intensity !== null;
    }

    /**
     * Gets the appropriate CSS class for this effect
     */
    getCssClass(): string {
        switch (this.type) {
            case TextEffectType.COLOR:
                return `text-color-${this.value.replace('#', '')}`;
            case TextEffectType.FLASH:
                return 'text-flash';
            case TextEffectType.SHAKE:
                return `text-shake-${this.intensity || 'medium'}`;
            default:
                return '';
        }
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            textSegmentId: this.textSegmentId,
            type: this.type,
            value: this.value,
            startDelay: this.startDelay,
            duration: this.duration,
            intensity: this.intensity,
            metadata: this.metadata
        };
    }

    /**
     * Creates a TextEffect instance from JSON data
     */
    static fromJSON(json: any): TextEffect {
        return new TextEffect(
            json.textSegmentId,
            json.type,
            json.value,
            json.startDelay,
            json.duration,
            json.intensity,
            json.metadata || {}
        );
    }
}