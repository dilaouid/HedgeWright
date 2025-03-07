/**
 * Statement model
 * Represents a single statement in a testimony
 */
import { v4 as uuidv4 } from 'uuid';

export class Statement {
    readonly uuid: string;
    readonly customId: string;
    readonly text: string;
    readonly messageId: string;
    readonly pressDialogueId: string | null;
    readonly crossExaminationId: string;
    readonly index: number;
    readonly isContradiction: boolean;
    readonly evidenceId: string | null;
    readonly profileId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        text: string,
        messageId: string,
        crossExaminationId: string,
        index: number,
        pressDialogueId: string | null = null,
        isContradiction: boolean = false,
        evidenceId: string | null = null,
        profileId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.text = text;
        this.messageId = messageId;
        this.pressDialogueId = pressDialogueId;
        this.crossExaminationId = crossExaminationId;
        this.index = index;
        this.isContradiction = isContradiction;
        this.evidenceId = evidenceId;
        this.profileId = profileId;
        this.metadata = metadata;
    }

    /**
     * Returns a new Statement with updated properties
     */
    update(updates: Partial<Omit<Statement, 'uuid'>>): Statement {
        return new Statement(
            updates.customId ?? this.customId,
            updates.text ?? this.text,
            updates.messageId ?? this.messageId,
            updates.crossExaminationId ?? this.crossExaminationId,
            updates.index ?? this.index,
            updates.pressDialogueId ?? this.pressDialogueId,
            updates.isContradiction ?? this.isContradiction,
            updates.evidenceId ?? this.evidenceId,
            updates.profileId ?? this.profileId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this statement can be pressed
     */
    canBePressed(): boolean {
        return this.pressDialogueId !== null;
    }

    /**
     * Checks if this statement has associated evidence
     */
    hasEvidence(): boolean {
        return this.evidenceId !== null;
    }

    /**
     * Checks if this statement has an associated profile
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
            text: this.text,
            messageId: this.messageId,
            pressDialogueId: this.pressDialogueId,
            crossExaminationId: this.crossExaminationId,
            index: this.index,
            isContradiction: this.isContradiction,
            evidenceId: this.evidenceId,
            profileId: this.profileId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Statement instance from JSON data
     */
    static fromJSON(json: any): Statement {
        return new Statement(
            json.customId,
            json.text,
            json.messageId,
            json.crossExaminationId,
            json.index,
            json.pressDialogueId,
            json.isContradiction,
            json.evidenceId,
            json.profileId,
            json.metadata || {}
        );
    }
}