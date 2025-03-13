/**
 * Profile model
 * Represents a character profile in the court record
 */
import { v4 as uuidv4 } from 'uuid';

export class Profile {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly age: string;
    readonly gender: string;
    readonly image: string;
    readonly description: string;
    readonly isInitiallyHidden: boolean;
    readonly switchConditionId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        age: string,
        gender: string,
        image: string,
        description: string,
        isInitiallyHidden: boolean = false,
        switchConditionId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.image = image;
        this.description = description;
        this.isInitiallyHidden = isInitiallyHidden;
        this.switchConditionId = switchConditionId;
        this.metadata = metadata;
    }

    /**
     * Returns a new Profile with updated properties
     */
    update(updates: Partial<Omit<Profile, 'uuid'>>): Profile {
        return new Profile(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.age ?? this.age,
            updates.gender ?? this.gender,
            updates.image ?? this.image,
            updates.description ?? this.description,
            updates.isInitiallyHidden ?? this.isInitiallyHidden,
            updates.switchConditionId ?? this.switchConditionId,
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
            age: this.age,
            gender: this.gender,
            image: this.image,
            description: this.description,
            isInitiallyHidden: this.isInitiallyHidden,
            switchConditionId: this.switchConditionId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Profile instance from JSON data
     */
    static fromJSON(json: any): Profile {
        return new Profile(
            json.customId,
            json.name,
            json.age,
            json.gender,
            json.image,
            json.description,
            json.isInitiallyHidden,
            json.switchConditionId,
            json.metadata || {}
        );
    }
}