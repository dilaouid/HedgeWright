/**
 * SceneTransition model
 * Represents a connection between two scenes that players can navigate
 */
import { v4 as uuidv4 } from 'uuid';

export class SceneTransition {
    readonly uuid: string;
    readonly customId: string;
    readonly previewImageId: string | null;
    readonly useDefaultPreview: boolean;
    readonly showUnvisitedEffect: boolean;
    readonly sourceSceneId: string;
    readonly targetSceneId: string;
    readonly label: string;
    readonly switchConditionId: string | null;
    readonly position: number;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        sourceSceneId: string,
        targetSceneId: string,
        label: string,
        position: number,
        previewImageId: string | null = null,
        useDefaultPreview: boolean = true,
        showUnvisitedEffect: boolean = true,
        switchConditionId: string | null = null,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.previewImageId = previewImageId;
        this.useDefaultPreview = useDefaultPreview;
        this.showUnvisitedEffect = showUnvisitedEffect;
        this.sourceSceneId = sourceSceneId;
        this.targetSceneId = targetSceneId;
        this.label = label;
        this.switchConditionId = switchConditionId;
        this.position = position;
        this.metadata = metadata;
    }

    /**
     * Returns a new SceneTransition with updated properties
     */
    update(updates: Partial<Omit<SceneTransition, 'uuid'>>): SceneTransition {
        return new SceneTransition(
            updates.customId ?? this.customId,
            updates.sourceSceneId ?? this.sourceSceneId,
            updates.targetSceneId ?? this.targetSceneId,
            updates.label ?? this.label,
            updates.position ?? this.position,
            updates.previewImageId ?? this.previewImageId,
            updates.useDefaultPreview ?? this.useDefaultPreview,
            updates.showUnvisitedEffect ?? this.showUnvisitedEffect,
            updates.switchConditionId ?? this.switchConditionId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this transition has a custom preview image
     */
    hasCustomPreview(): boolean {
        return this.previewImageId !== null && !this.useDefaultPreview;
    }

    /**
     * Checks if this transition has a switch condition
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
            previewImageId: this.previewImageId,
            useDefaultPreview: this.useDefaultPreview,
            showUnvisitedEffect: this.showUnvisitedEffect,
            sourceSceneId: this.sourceSceneId,
            targetSceneId: this.targetSceneId,
            label: this.label,
            switchConditionId: this.switchConditionId,
            position: this.position,
            metadata: this.metadata
        };
    }

    /**
     * Creates a SceneTransition instance from JSON data
     */
    static fromJSON(json: any): SceneTransition {
        return new SceneTransition(
            json.customId,
            json.sourceSceneId,
            json.targetSceneId,
            json.label,
            json.position,
            json.previewImageId,
            json.useDefaultPreview,
            json.showUnvisitedEffect,
            json.switchConditionId,
            json.metadata || {}
        );
    }
}