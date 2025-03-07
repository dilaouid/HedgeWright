/**
 * TextSegment model
 * Represents a portion of text within a message, with specific formatting or effects
 */
import { v4 as uuidv4 } from 'uuid';

export class TextSegment {
    readonly uuid: string;
    readonly messageId: string;
    readonly text: string;
    readonly startIndex: number;
    readonly endIndex: number;
    readonly position: number;

    constructor(
        messageId: string,
        text: string,
        startIndex: number,
        endIndex: number,
        position: number
    ) {
        this.uuid = uuidv4();
        this.messageId = messageId;
        this.text = text;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.position = position;
    }

    /**
     * Returns a new TextSegment with updated properties
     */
    update(updates: Partial<Omit<TextSegment, 'uuid'>>): TextSegment {
        return new TextSegment(
            updates.messageId ?? this.messageId,
            updates.text ?? this.text,
            updates.startIndex ?? this.startIndex,
            updates.endIndex ?? this.endIndex,
            updates.position ?? this.position
        );
    }

    /**
     * Gets the length of this text segment
     */
    getLength(): number {
        return this.text.length;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            messageId: this.messageId,
            text: this.text,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            position: this.position
        };
    }

    /**
     * Creates a TextSegment instance from JSON data
     */
    static fromJSON(json: any): TextSegment {
        return new TextSegment(
            json.messageId,
            json.text,
            json.startIndex,
            json.endIndex,
            json.position
        );
    }
}