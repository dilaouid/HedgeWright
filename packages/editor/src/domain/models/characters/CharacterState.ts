/**
 * CharacterState model
 * Represents a specific visual state of a character (default, angry, sad, etc.)
 */
import { v4 as uuidv4 } from 'uuid';

export class CharacterState {
    readonly uuid: string;
    readonly characterId: string;
    readonly name: string;
    readonly idleAnimationId: string | null;
    readonly talkingAnimationId: string | null;
    readonly specialAnimationId: string | null;
    readonly specialSoundId: string | null;
    readonly specialSoundDelay: number;
    readonly metadata: Record<string, any>;

    constructor(
        characterId: string,
        name: string,
        idleAnimationId: string | null = null,
        talkingAnimationId: string | null = null,
        specialAnimationId: string | null = null,
        specialSoundId: string | null = null,
        specialSoundDelay: number = 0,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.characterId = characterId;
        this.name = name;
        this.idleAnimationId = idleAnimationId;
        this.talkingAnimationId = talkingAnimationId;
        this.specialAnimationId = specialAnimationId;
        this.specialSoundId = specialSoundId;
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
            updates.idleAnimationId ?? this.idleAnimationId,
            updates.talkingAnimationId ?? this.talkingAnimationId,
            updates.specialAnimationId ?? this.specialAnimationId,
            updates.specialSoundId ?? this.specialSoundId,
            updates.specialSoundDelay ?? this.specialSoundDelay,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this state has a special animation
     */
    hasSpecialAnimation(): boolean {
        return this.specialAnimationId !== null;
    }

    /**
     * Checks if this state has a special sound effect
     */
    hasSpecialSound(): boolean {
        return this.specialSoundId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            characterId: this.characterId,
            name: this.name,
            idleAnimationId: this.idleAnimationId,
            talkingAnimationId: this.talkingAnimationId,
            specialAnimationId: this.specialAnimationId,
            specialSoundId: this.specialSoundId,
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
            json.idleAnimationId,
            json.talkingAnimationId,
            json.specialAnimationId,
            json.specialSoundId,
            json.specialSoundDelay,
            json.metadata || {}
        );
    }
}