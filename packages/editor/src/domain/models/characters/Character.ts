/**
 * Character model
 * Represents a game character that can appear in scenes and speak dialogue
 */
import { v4 as uuidv4 } from 'uuid';

export class Character {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly profileId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        profileId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.profileId = profileId;
        this.metadata = metadata;
    }

    /**
     * Returns a new Character with updated properties
     */
    update(updates: Partial<Omit<Character, 'uuid'>>): Character {
        return new Character(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.profileId ?? this.profileId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this character is associated with a profile
     */
    hasProfile(): boolean {
        return this.profileId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            profileId: this.profileId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Character instance from JSON data
     */
    static fromJSON(json: any): Character {
        return new Character(
            json.customId,
            json.name,
            json.profileId,
            json.metadata || {}
        );
    }
}