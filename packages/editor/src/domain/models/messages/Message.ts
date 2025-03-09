/**
 * Message model
 * Represents a single message in a dialogue
 */
import { MessagePosition, VoiceType } from '@hedgewright/common';
import { v4 as uuidv4 } from 'uuid';

export class Message {
    readonly uuid: string;
    readonly customId: string;
    readonly rawText: string;
    readonly backgroundId: string;
    readonly characterId: string | null;
    readonly characterState: string | null;
    readonly characterPosition: string | null;
    readonly speakerName: string | null;
    readonly showSpeakerName: boolean;
    readonly typewritingSpeed: number;
    readonly typewritingSoundType: VoiceType;
    readonly messagePosition: MessagePosition;
    readonly dialogueId: string | null;
    readonly nextMessageId: string | null;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        rawText: string,
        backgroundId: string,
        position: number,
        characterId: string | null = null,
        characterState: string | null = null,
        characterPosition: string | null = null,
        speakerName: string | null = null,
        showSpeakerName: boolean = true,
        typewritingSpeed: number = 30,
        typewritingSoundType: VoiceType = VoiceType.DEFAULT,
        messagePosition: MessagePosition = MessagePosition.DEFAULT,
        dialogueId: string | null = null,
        nextMessageId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.rawText = rawText;
        this.backgroundId = backgroundId;
        this.characterId = characterId;
        this.characterState = characterState;
        this.characterPosition = characterPosition;
        this.speakerName = speakerName;
        this.showSpeakerName = showSpeakerName;
        this.typewritingSpeed = typewritingSpeed;
        this.typewritingSoundType = typewritingSoundType;
        this.messagePosition = messagePosition;
        this.dialogueId = dialogueId;
        this.nextMessageId = nextMessageId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new Message with updated properties
     */
    update(updates: Partial<Omit<Message, 'uuid'>>): Message {
        return new Message(
            updates.customId ?? this.customId,
            updates.rawText ?? this.rawText,
            updates.backgroundId ?? this.backgroundId,
            updates.position ?? this.position,
            updates.characterId ?? this.characterId,
            updates.characterState ?? this.characterState,
            updates.characterPosition ?? this.characterPosition,
            updates.speakerName ?? this.speakerName,
            updates.showSpeakerName ?? this.showSpeakerName,
            updates.typewritingSpeed ?? this.typewritingSpeed,
            updates.typewritingSoundType ?? this.typewritingSoundType,
            updates.messagePosition ?? this.messagePosition,
            updates.dialogueId ?? this.dialogueId,
            updates.nextMessageId ?? this.nextMessageId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this message has a character
     */
    hasCharacter(): boolean {
        return this.characterId !== null;
    }

    /**
     * Checks if this message has a next message
     */
    hasNextMessage(): boolean {
        return this.nextMessageId !== null;
    }

    /**
     * Checks if this message belongs to a dialogue
     */
    belongsToDialogue(): boolean {
        return this.dialogueId !== null;
    }

    /**
     * Checks if this message should show speaker name
     */
    shouldShowSpeakerName(): boolean {
        return this.showSpeakerName && this.speakerName !== null;
    }

    /**
     * Gets the effective speaker name to display
     */
    getEffectiveSpeakerName(): string | null {
        if (!this.shouldShowSpeakerName()) {
            return null;
        }
        return this.speakerName;
    }

    /**
     * Checks if this message has voice typing sound
     */
    hasTypingSound(): boolean {
        return this.typewritingSoundType !== VoiceType.NONE;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            rawText: this.rawText,
            backgroundId: this.backgroundId,
            characterId: this.characterId,
            characterState: this.characterState,
            characterPosition: this.characterPosition,
            speakerName: this.speakerName,
            showSpeakerName: this.showSpeakerName,
            typewritingSpeed: this.typewritingSpeed,
            typewritingSoundType: this.typewritingSoundType,
            messagePosition: this.messagePosition,
            dialogueId: this.dialogueId,
            nextMessageId: this.nextMessageId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Message instance from JSON data
     */
    static fromJSON(json: any): Message {
        return new Message(
            json.customId,
            json.rawText,
            json.backgroundId,
            json.position,
            json.characterId,
            json.characterState,
            json.characterPosition,
            json.speakerName,
            json.showSpeakerName,
            json.typewritingSpeed,
            json.typewritingSoundType || VoiceType.DEFAULT,
            json.messagePosition,
            json.dialogueId,
            json.nextMessageId,
            json.metadata || {}
        );
    }
}