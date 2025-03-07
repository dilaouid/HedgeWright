/**
 * Document model
 * Represents a document attached to an evidence item
 */
import { v4 as uuidv4 } from 'uuid';

export class Document {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly content: string;
    readonly evidenceId: string;
    readonly page: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        content: string,
        evidenceId: string,
        page: number = 1,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.content = content;
        this.evidenceId = evidenceId;
        this.page = page;
        this.metadata = metadata;
    }

    /**
     * Returns a new Document with updated properties
     */
    update(updates: Partial<Omit<Document, 'uuid'>>): Document {
        return new Document(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.content ?? this.content,
            updates.evidenceId ?? this.evidenceId,
            updates.page ?? this.page,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            content: this.content,
            evidenceId: this.evidenceId,
            page: this.page,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Document instance from JSON data
     */
    static fromJSON(json: any): Document {
        return new Document(
            json.customId,
            json.name,
            json.content,
            json.evidenceId,
            json.page,
            json.metadata || {}
        );
    }
}