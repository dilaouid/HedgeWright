/**
 * InvestigationScene model
 * Represents the relationship between an investigation and a scene
 */
import { v4 as uuidv4 } from 'uuid';

export class InvestigationScene {
    readonly uuid: string;
    readonly investigationId: string;
    readonly sceneId: string;
    readonly position: number;
    readonly isInitialScene: boolean;
    readonly metadata: Record<string, any>;

    constructor(
        investigationId: string,
        sceneId: string,
        position: number,
        isInitialScene: boolean = false,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.investigationId = investigationId;
        this.sceneId = sceneId;
        this.position = position;
        this.isInitialScene = isInitialScene;
        this.metadata = metadata;
    }

    /**
     * Returns a new InvestigationScene with updated properties
     */
    update(updates: Partial<Omit<InvestigationScene, 'uuid'>>): InvestigationScene {
        return new InvestigationScene(
            updates.investigationId ?? this.investigationId,
            updates.sceneId ?? this.sceneId,
            updates.position ?? this.position,
            updates.isInitialScene ?? this.isInitialScene,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            investigationId: this.investigationId,
            sceneId: this.sceneId,
            position: this.position,
            isInitialScene: this.isInitialScene,
            metadata: this.metadata
        };
    }

    /**
     * Creates an InvestigationScene instance from JSON data
     */
    static fromJSON(json: any): InvestigationScene {
        return new InvestigationScene(
            json.investigationId,
            json.sceneId,
            json.position,
            json.isInitialScene,
            json.metadata || {}
        );
    }
}