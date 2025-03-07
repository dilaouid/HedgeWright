/**
 * CrossExaminationBubbleSettings model
 * Represents bubble settings for a specific cross-examination
 */
import { v4 as uuidv4 } from 'uuid';

export class CrossExaminationBubbleSettings {
    readonly uuid: string;
    readonly crossExaminationId: string;
    readonly bubbleSetId: string;
    readonly objectionBubbleId: string | null;
    readonly holdItBubbleId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        crossExaminationId: string,
        bubbleSetId: string,
        objectionBubbleId: string | null = null,
        holdItBubbleId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.crossExaminationId = crossExaminationId;
        this.bubbleSetId = bubbleSetId;
        this.objectionBubbleId = objectionBubbleId;
        this.holdItBubbleId = holdItBubbleId;
        this.metadata = metadata;
    }

    /**
     * Returns a new CrossExaminationBubbleSettings with updated properties
     */
    update(updates: Partial<Omit<CrossExaminationBubbleSettings, 'uuid'>>): CrossExaminationBubbleSettings {
        return new CrossExaminationBubbleSettings(
            updates.crossExaminationId ?? this.crossExaminationId,
            updates.bubbleSetId ?? this.bubbleSetId,
            updates.objectionBubbleId ?? this.objectionBubbleId,
            updates.holdItBubbleId ?? this.holdItBubbleId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this setting overrides the objection bubble
     */
    hasObjectionOverride(): boolean {
        return this.objectionBubbleId !== null;
    }

    /**
     * Checks if this setting overrides the hold it bubble
     */
    hasHoldItOverride(): boolean {
        return this.holdItBubbleId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            crossExaminationId: this.crossExaminationId,
            bubbleSetId: this.bubbleSetId,
            objectionBubbleId: this.objectionBubbleId,
            holdItBubbleId: this.holdItBubbleId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a CrossExaminationBubbleSettings instance from JSON data
     */
    static fromJSON(json: any): CrossExaminationBubbleSettings {
        return new CrossExaminationBubbleSettings(
            json.crossExaminationId,
            json.bubbleSetId,
            json.objectionBubbleId,
            json.holdItBubbleId,
            json.metadata || {}
        );
    }
}