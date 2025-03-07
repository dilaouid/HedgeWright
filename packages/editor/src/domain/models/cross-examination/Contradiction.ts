/**
 * Contradiction model
 * Represents a logical contradiction in testimony that can be exposed with evidence
 */
import { v4 as uuidv4 } from 'uuid';

export class Contradiction {
    readonly uuid: string;
    readonly statementId: string;
    readonly evidenceId: string | null;
    readonly profileId: string | null;
    readonly dialogueId: string;
    readonly endsTestimony: boolean;
    readonly switchToActivate: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        statementId: string,
        dialogueId: string,
        evidenceId: string | null = null,
        profileId: string | null = null,
        endsTestimony: boolean = false,
        switchToActivate: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.statementId = statementId;
        this.evidenceId = evidenceId;
        this.profileId = profileId;
        this.dialogueId = dialogueId;
        this.endsTestimony = endsTestimony;
        this.switchToActivate = switchToActivate;
        this.metadata = metadata;
    }

    /**
     * Returns a new Contradiction with updated properties
     */
    update(updates: Partial<Omit<Contradiction, 'uuid'>>): Contradiction {
        return new Contradiction(
            updates.statementId ?? this.statementId,
            updates.dialogueId ?? this.dialogueId,
            updates.evidenceId ?? this.evidenceId,
            updates.profileId ?? this.profileId,
            updates.endsTestimony ?? this.endsTestimony,
            updates.switchToActivate ?? this.switchToActivate,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this contradiction uses evidence
     */
    usesEvidence(): boolean {
        return this.evidenceId !== null;
    }

    /**
     * Checks if this contradiction uses a profile
     */
    usesProfile(): boolean {
        return this.profileId !== null;
    }

    /**
     * Checks if this contradiction activates a switch
     */
    activatesSwitch(): boolean {
        return this.switchToActivate !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            statementId: this.statementId,
            evidenceId: this.evidenceId,
            profileId: this.profileId,
            dialogueId: this.dialogueId,
            endsTestimony: this.endsTestimony,
            switchToActivate: this.switchToActivate,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Contradiction instance from JSON data
     */
    static fromJSON(json: any): Contradiction {
        return new Contradiction(
            json.statementId,
            json.dialogueId,
            json.evidenceId,
            json.profileId,
            json.endsTestimony,
            json.switchToActivate,
            json.metadata || {}
        );
    }
}