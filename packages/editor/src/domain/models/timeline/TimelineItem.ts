import { TimelineItemType } from '@hedgewright/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents an item in the level timeline
 * The timeline organizes scenes, messages, cross-examinations, and dialogues
 */
export class TimelineItem {
    readonly uuid: string;
    readonly itemType: TimelineItemType;
    readonly itemId: string;
    readonly position: number;
    readonly parentItemId?: string;
    readonly metadata: Record<string, any>;

    constructor(
        itemType: TimelineItemType,
        itemId: string,
        position: number,
        parentItemId?: string,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.itemType = itemType;
        this.itemId = itemId;
        this.position = position;
        this.parentItemId = parentItemId;
        this.metadata = metadata;
    }

    /**
     * Creates a new TimelineItem with updated properties
     * @param updates Object containing property updates
     * @returns A new TimelineItem with updated properties
     */
    update(updates: Partial<Omit<TimelineItem, 'uuid'>>): TimelineItem {
        return new TimelineItem(
            updates.itemType ?? this.itemType,
            updates.itemId ?? this.itemId,
            updates.position ?? this.position,
            updates.parentItemId ?? this.parentItemId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this is a nested timeline item
     */
    isNested(): boolean {
        return !!this.parentItemId;
    }

    /**
     * Checks if this item is a scene
     */
    isScene(): boolean {
        return this.itemType === TimelineItemType.SCENE;
    }

    /**
     * Checks if this item is a message
     */
    isMessage(): boolean {
        return this.itemType === TimelineItemType.MESSAGE;
    }

    /**
     * Checks if this item is a cross-examination
     */
    isCrossExamination(): boolean {
        return this.itemType === TimelineItemType.CROSS_EXAMINATION;
    }

    /**
     * Checks if this item is a dialogue
     */
    isDialogue(): boolean {
        return this.itemType === TimelineItemType.DIALOGUE;
    }

    /**
     * Serializes the object to JSON
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            itemType: this.itemType,
            itemId: this.itemId,
            position: this.position,
            parentItemId: this.parentItemId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a TimelineItem from a JSON object
     */
    static fromJSON(json: any): TimelineItem {
        return new TimelineItem(
            json.itemType,
            json.itemId,
            json.position,
            json.parentItemId,
            json.metadata || {}
        );
    }
}