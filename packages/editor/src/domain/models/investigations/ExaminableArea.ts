/**
 * ExaminableArea model
 * Represents an interactive hotspot in a scene that can be examined
 */
import { v4 as uuidv4 } from 'uuid';

export class ExaminableArea {
    readonly uuid: string;
    readonly customId: string;
    readonly sceneId: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly dialogueId: string;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        sceneId: string,
        x: number,
        y: number,
        width: number,
        height: number,
        dialogueId: string,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.sceneId = sceneId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dialogueId = dialogueId;
        this.metadata = metadata;
    }

    /**
     * Returns a new ExaminableArea with updated properties
     */
    update(updates: Partial<Omit<ExaminableArea, 'uuid'>>): ExaminableArea {
        return new ExaminableArea(
            updates.customId ?? this.customId,
            updates.sceneId ?? this.sceneId,
            updates.x ?? this.x,
            updates.y ?? this.y,
            updates.width ?? this.width,
            updates.height ?? this.height,
            updates.dialogueId ?? this.dialogueId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Gets the position and size as a rectangle object
     */
    getRectangle(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks if a point is inside this examinable area
     */
    containsPoint(x: number, y: number): boolean {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    /**
     * Converts to a JSON-serializable format
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            sceneId: this.sceneId,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            dialogueId: this.dialogueId,
            metadata: this.metadata
        };
    }

    /**
     * Creates an ExaminableArea instance from JSON data
     */
    static fromJSON(json: any): ExaminableArea {
        return new ExaminableArea(
            json.customId,
            json.sceneId,
            json.x,
            json.y,
            json.width,
            json.height,
            json.dialogueId,
            json.metadata || {}
        );
    }
}