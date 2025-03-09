/**
 * CrossExamination model
 * Represents a testimony and cross-examination sequence
 */
import { v4 as uuidv4 } from 'uuid';

export class CrossExamination {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly witnessId: string;
    readonly prosecutorId: string | null;
    readonly defenseAttorneyId: string | null;
    readonly introDialogueId: string | null;
    readonly loopIntroDialogueId: string | null;
    readonly successDialogueId: string | null;
    readonly failureDialogueId: string | null;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        witnessId: string,
        prosecutorId: string | null = null,
        defenseAttorneyId: string | null = null,
        position: number,
        introDialogueId: string | null = null,
        loopIntroDialogueId: string | null = null,
        successDialogueId: string | null = null,
        failureDialogueId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.witnessId = witnessId;
        this.prosecutorId = prosecutorId;
        this.defenseAttorneyId = defenseAttorneyId;
        this.introDialogueId = introDialogueId;
        this.loopIntroDialogueId = loopIntroDialogueId;
        this.successDialogueId = successDialogueId;
        this.failureDialogueId = failureDialogueId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new CrossExamination with updated properties
     */
    update(updates: Partial<Omit<CrossExamination, 'uuid'>>): CrossExamination {
        return new CrossExamination(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.witnessId ?? this.witnessId,
            updates.prosecutorId ?? this.prosecutorId,
            updates.defenseAttorneyId ?? this.defenseAttorneyId,
            updates.position ?? this.position,
            updates.introDialogueId ?? this.introDialogueId,
            updates.loopIntroDialogueId ?? this.loopIntroDialogueId,
            updates.successDialogueId ?? this.successDialogueId,
            updates.failureDialogueId ?? this.failureDialogueId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this cross-examination has a prosecutor
     */
    hasProsecutor(): boolean {
        return this.prosecutorId !== null;
    }

    /**
     * Checks if this cross-examination has a defense attorney
     */
    hasDefenseAttorney(): boolean {
        return this.defenseAttorneyId !== null;
    }

    /**
     * Checks if this cross-examination has an intro dialogue
     */
    hasIntroDialogue(): boolean {
        return this.introDialogueId !== null;
    }

    /**
     * Checks if this cross-examination has a loop intro dialogue
     */
    hasLoopIntroDialogue(): boolean {
        return this.loopIntroDialogueId !== null;
    }

    /**
     * Checks if this cross-examination has a success dialogue
     */
    hasSuccessDialogue(): boolean {
        return this.successDialogueId !== null;
    }

    /**
     * Checks if this cross-examination has a failure dialogue
     */
    hasFailureDialogue(): boolean {
        return this.failureDialogueId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            witnessId: this.witnessId,
            prosecutorId: this.prosecutorId,
            defenseAttorneyId: this.defenseAttorneyId,
            introDialogueId: this.introDialogueId,
            loopIntroDialogueId: this.loopIntroDialogueId,
            successDialogueId: this.successDialogueId,
            failureDialogueId: this.failureDialogueId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates a CrossExamination instance from JSON data
     */
    static fromJSON(json: any): CrossExamination {
        return new CrossExamination(
            json.customId,
            json.name,
            json.witnessId,
            json.prosecutorId,
            json.defenseAttorneyId,
            json.position,
            json.introDialogueId,
            json.loopIntroDialogueId,
            json.successDialogueId,
            json.failureDialogueId,
            json.metadata || {}
        );
    }
}