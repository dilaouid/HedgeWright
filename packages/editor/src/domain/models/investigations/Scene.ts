/**
 * Scene model
 * Represents a location in the game that players can investigate
 */
import { v4 as uuidv4 } from 'uuid';

export class Scene {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly backgroundId: string;
    readonly isDoubleScreen: boolean;
    readonly characterId: string | null;
    readonly characterPosition: string;
    readonly introDialogueId: string | null;
    readonly conclusionDialogueId: string | null;
    readonly conclusionDialogueSwitchId: string | null;
    readonly switchConditionId: string | null;
    readonly defaultErrorExaminationDialogueId: string | null;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        backgroundId: string,
        position: number,
        isDoubleScreen: boolean = false,
        characterId: string | null = null,
        characterPosition: string = "center",
        introDialogueId: string | null = null,
        conclusionDialogueId: string | null = null,
        conclusionDialogueSwitchId: string | null = null,
        switchConditionId: string | null = null,
        defaultErrorExaminationDialogueId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.backgroundId = backgroundId;
        this.isDoubleScreen = isDoubleScreen;
        this.characterId = characterId;
        this.characterPosition = characterPosition;
        this.introDialogueId = introDialogueId;
        this.conclusionDialogueId = conclusionDialogueId;
        this.conclusionDialogueSwitchId = conclusionDialogueSwitchId;
        this.switchConditionId = switchConditionId;
        this.defaultErrorExaminationDialogueId = defaultErrorExaminationDialogueId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new Scene with updated properties
     */
    update(updates: Partial<Omit<Scene, 'uuid'>>): Scene {
        return new Scene(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.backgroundId ?? this.backgroundId,
            updates.position ?? this.position,
            updates.isDoubleScreen ?? this.isDoubleScreen,
            updates.characterId ?? this.characterId,
            updates.characterPosition ?? this.characterPosition,
            updates.introDialogueId ?? this.introDialogueId,
            updates.conclusionDialogueId ?? this.conclusionDialogueId,
            updates.conclusionDialogueSwitchId ?? this.conclusionDialogueSwitchId,
            updates.switchConditionId ?? this.switchConditionId,
            updates.defaultErrorExaminationDialogueId ?? this.defaultErrorExaminationDialogueId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if the scene has a character
     */
    hasCharacter(): boolean {
        return this.characterId !== null;
    }

    /**
     * Checks if the scene has an intro dialogue
     */
    hasIntroDialogue(): boolean {
        return this.introDialogueId !== null;
    }

    /**
     * Checks if the scene has a conclusion dialogue
     */
    hasConclusionDialogue(): boolean {
        return this.conclusionDialogueId !== null;
    }

    /**
     * Checks if the scene has a switch condition
     */
    hasSwitchCondition(): boolean {
        return this.switchConditionId !== null;
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            backgroundId: this.backgroundId,
            isDoubleScreen: this.isDoubleScreen,
            characterId: this.characterId,
            characterPosition: this.characterPosition,
            introDialogueId: this.introDialogueId,
            conclusionDialogueId: this.conclusionDialogueId,
            conclusionDialogueSwitchId: this.conclusionDialogueSwitchId,
            switchConditionId: this.switchConditionId,
            defaultErrorExaminationDialogueId: this.defaultErrorExaminationDialogueId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates a Scene instance from JSON data
     */
    static fromJSON(json: any): Scene {
        return new Scene(
            json.customId,
            json.name,
            json.backgroundId,
            json.position,
            json.isDoubleScreen,
            json.characterId,
            json.characterPosition,
            json.introDialogueId,
            json.conclusionDialogueId,
            json.conclusionDialogueSwitchId,
            json.switchConditionId,
            json.defaultErrorExaminationDialogueId,
            json.metadata || {}
        );
    }
}