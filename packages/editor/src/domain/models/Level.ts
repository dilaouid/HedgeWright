/**
 * Level model
 * Represents a complete game level with all associated content
 */
import { v4 as uuidv4 } from 'uuid';

export class Level {
    readonly uuid: string;
    readonly title: string;
    readonly author: string;
    readonly description: string;
    readonly version: string;
    readonly gameOverDialogueId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly metadata: Record<string, any>;

    constructor(
        title: string,
        author: string,
        description: string,
        version: string,
        gameOverDialogueId: string,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.title = title;
        this.author = author;
        this.description = description;
        this.version = version;
        this.gameOverDialogueId = gameOverDialogueId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.metadata = metadata;
    }

    /**
     * Returns a new Level with updated properties and updated timestamp
     */
    update(updates: Partial<Omit<Level, 'uuid' | 'createdAt' | 'updatedAt'>>): Level {
        return new Level(
            updates.title ?? this.title,
            updates.author ?? this.author,
            updates.description ?? this.description,
            updates.version ?? this.version,
            updates.gameOverDialogueId ?? this.gameOverDialogueId,
            this.createdAt,
            new Date(),
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            title: this.title,
            author: this.author,
            description: this.description,
            version: this.version,
            gameOverDialogueId: this.gameOverDialogueId,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            metadata: this.metadata
        };
    }

    /**
     * Creates a Level instance from JSON data
     */
    static fromJSON(json: any): Level {
        return new Level(
            json.title,
            json.author,
            json.description,
            json.version,
            json.gameOverDialogueId,
            new Date(json.createdAt),
            new Date(json.updatedAt),
            json.metadata || {}
        );
    }
}