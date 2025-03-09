/**
 * MessageBubble model
 * Represents a bubble attached to a specific message or dialogue
 */
import { v4 as uuidv4 } from 'uuid';

export class MessageBubble {
    readonly uuid: string;
    readonly beforeMessageId: string | null;
    readonly afterMessageId: string | null;
    readonly dialogueId: string | null;
    readonly bubbleId: string;
    readonly metadata: Record<string, any>;

    constructor(
        bubbleId: string,
        beforeMessageId: string | null = null,
        afterMessageId: string | null = null,
        dialogueId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.beforeMessageId = beforeMessageId;
        this.afterMessageId = afterMessageId;
        this.dialogueId = dialogueId;
        this.bubbleId = bubbleId;
        this.metadata = metadata;
    }

    /**
     * Returns a new MessageBubble with updated properties
     */
    update(updates: Partial<Omit<MessageBubble, 'uuid'>>): MessageBubble {
        return new MessageBubble(
            updates.bubbleId ?? this.bubbleId,
            updates.beforeMessageId ?? this.beforeMessageId,
            updates.afterMessageId ?? this.afterMessageId,
            updates.dialogueId ?? this.dialogueId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this bubble appears before a message
     */
    appearsBeforeMessage(): boolean {
        return this.beforeMessageId !== null;
    }

    /**
     * Checks if this bubble appears after a message
     */
    appearsAfterMessage(): boolean {
        return this.afterMessageId !== null;
    }

    /**
     * Checks if this bubble is associated with a dialogue
     */
    belongsToDialogue(): boolean {
        return this.dialogueId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            beforeMessageId: this.beforeMessageId,
            afterMessageId: this.afterMessageId,
            dialogueId: this.dialogueId,
            bubbleId: this.bubbleId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a MessageBubble instance from JSON data
     */
    static fromJSON(json: any): MessageBubble {
        return new MessageBubble(
            json.bubbleId,
            json.beforeMessageId,
            json.afterMessageId,
            json.dialogueId,
            json.metadata || {}
        );
    }
}