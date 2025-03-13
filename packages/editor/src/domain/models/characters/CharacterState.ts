/**
 * CharacterState model
 * Represents a specific visual state of a character (default, angry, sad, etc.)
 */
import { v4 as uuidv4 } from 'uuid';

export class CharacterState {
    readonly uuid: string;
    readonly characterId: string;
    readonly name: string;
    readonly idleAnimation: string | null;
    readonly talkingAnimation: string | null;
    readonly specialAnimation: string | null;
    readonly specialSound: string | null;
    readonly specialSoundDelay: number;
    readonly metadata: Record<string, any>;

    constructor(
        characterId: string,
        name: string,
        idleAnimation: string | null = null,
        talkingAnimation: string | null = null,
        specialAnimation: string | null = null,
        specialSound: string | null = null,
        specialSoundDelay: number = 0,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.characterId = characterId;
        this.name = name;
        this.idleAnimation = idleAnimation;
        this.talkingAnimation = talkingAnimation;
        this.specialAnimation = specialAnimation;
        this.specialSound = specialSound;
        this.specialSoundDelay = specialSoundDelay;
        this.metadata = metadata;
    }

    /**
     * Returns a new CharacterState with updated properties
     */
    update(updates: Partial<Omit<CharacterState, 'uuid'>>): CharacterState {
        return new CharacterState(
            updates.characterId ?? this.characterId,
            updates.name ?? this.name,
            updates.idleAnimation ?? this.idleAnimation,
            updates.talkingAnimation ?? this.talkingAnimation,
            updates.specialAnimation ?? this.specialAnimation,
            updates.specialSound ?? this.specialSound,
            updates.specialSoundDelay ?? this.specialSoundDelay,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this state has a special animation
     */
    hasSpecialAnimation(): boolean {
        return this.specialAnimation !== null;
    }

    /**
     * Checks if this state has a special sound effect
     */
    hasSpecialSound(): boolean {
        return this.specialSound !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            characterId: this.characterId,
            name: this.name,
            idleAnimation: this.idleAnimation,
            talkingAnimation: this.talkingAnimation,
            specialAnimation: this.specialAnimation,
            specialSound: this.specialSound,
            specialSoundDelay: this.specialSoundDelay,
            metadata: this.metadata
        };
    }

    /**
     * Creates a CharacterState instance from JSON data
     */
    static fromJSON(json: any): CharacterState {
        return new CharacterState(
            json.characterId,
            json.name,
            json.idleAnimation,
            json.talkingAnimation,
            json.specialAnimation,
            json.specialSound,
            json.specialSoundDelay,
            json.metadata || {}
        );
    }
}