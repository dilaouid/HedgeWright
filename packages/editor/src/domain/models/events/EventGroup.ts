/**
 * EventGroup model
 * Represents a grouping of related events
 */
import { v4 as uuidv4 } from 'uuid';

export class EventGroup {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly afterMessageId: string | null;
    readonly beforeMessageId: string | null;
    readonly dialogueId: string | null;
    readonly isCollapsed: boolean;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        position: number,
        afterMessageId: string | null = null,
        beforeMessageId: string | null = null,
        dialogueId: string | null = null,
        isCollapsed: boolean = false,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.afterMessageId = afterMessageId;
        this.beforeMessageId = beforeMessageId;
        this.dialogueId = dialogueId;
        this.isCollapsed = isCollapsed;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new EventGroup with updated properties
     */
    update(updates: Partial<Omit<EventGroup, 'uuid'>>): EventGroup {
        return new EventGroup(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.position ?? this.position,
            updates.afterMessageId ?? this.afterMessageId,
            updates.beforeMessageId ?? this.beforeMessageId,
            updates.dialogueId ?? this.dialogueId,
            updates.isCollapsed ?? this.isCollapsed,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this group executes after a message
     */
    executesAfterMessage(): boolean {
        return this.afterMessageId !== null;
    }

    /**
     * Checks if this group executes before a message
     */
    executesBeforeMessage(): boolean {
        return this.beforeMessageId !== null;
    }

    /**
     * Checks if this group is associated with a dialogue
     */
    isAssociatedWithDialogue(): boolean {
        return this.dialogueId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            afterMessageId: this.afterMessageId,
            beforeMessageId: this.beforeMessageId,
            dialogueId: this.dialogueId,
            isCollapsed: this.isCollapsed,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates an EventGroup instance from JSON data
     */
    static fromJSON(json: any): EventGroup {
        return new EventGroup(
            json.customId,
            json.name,
            json.position,
            json.afterMessageId,
            json.beforeMessageId,
            json.dialogueId,
            json.isCollapsed,
            json.metadata || {}
        );
    }
}