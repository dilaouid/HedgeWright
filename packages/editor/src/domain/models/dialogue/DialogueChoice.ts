/**
 * DialogueChoice model
 * Represents a choice option presented to the player in a dialogue
 */
import { v4 as uuidv4 } from 'uuid';

export class DialogueChoice {
    readonly uuid: string;
    readonly dialogueId: string;
    readonly text: string;
    readonly targetDialogueId: string | null;
    readonly targetMessageId: string | null;
    readonly position: number;
    readonly switchConditionId: string | null;
    readonly metadata: Record<string, any>;

    constructor(
        dialogueId: string,
        text: string,
        position: number,
        targetDialogueId: string | null = null,
        targetMessageId: string | null = null,
        switchConditionId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.dialogueId = dialogueId;
        this.text = text;
        this.targetDialogueId = targetDialogueId;
        this.targetMessageId = targetMessageId;
        this.position = position;
        this.switchConditionId = switchConditionId;
        this.metadata = metadata;
    }

    /**
     * Returns a new DialogueChoice with updated properties
     */
    update(updates: Partial<Omit<DialogueChoice, 'uuid'>>): DialogueChoice {
        return new DialogueChoice(
            updates.dialogueId ?? this.dialogueId,
            updates.text ?? this.text,
            updates.position ?? this.position,
            updates.targetDialogueId ?? this.targetDialogueId,
            updates.targetMessageId ?? this.targetMessageId,
            updates.switchConditionId ?? this.switchConditionId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this choice has a target dialogue
     */
    hasTargetDialogue(): boolean {
        return this.targetDialogueId !== null;
    }

    /**
     * Checks if this choice has a direct target message
     */
    hasTargetMessage(): boolean {
        return this.targetMessageId !== null;
    }

    /**
     * Checks if this choice has a switch condition
     */
    hasSwitchCondition(): boolean {
        return this.switchConditionId !== null;
    }

    /**
     * Gets the target ID (dialogue or message)
     */
    getTargetId(): string | null {
        return this.targetDialogueId || this.targetMessageId;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            dialogueId: this.dialogueId,
            text: this.text,
            targetDialogueId: this.targetDialogueId,
            targetMessageId: this.targetMessageId,
            position: this.position,
            switchConditionId: this.switchConditionId,
            metadata: this.metadata
        };
    }

    /**
     * Creates a DialogueChoice instance from JSON data
     */
    static fromJSON(json: any): DialogueChoice {
        return new DialogueChoice(
            json.dialogueId,
            json.text,
            json.position,
            json.targetDialogueId,
            json.targetMessageId,
            json.switchConditionId,
            json.metadata || {}
        );
    }
}