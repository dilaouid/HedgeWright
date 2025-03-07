import { EvidenceBehavior } from '@hedgewright/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents an evidence item in the court record
 * Evidence can be presented during trials, investigations, and cross-examinations
 */
export class Evidence {
    readonly uuid: string;
    readonly customId: string;
    readonly name: string;
    readonly type: string;
    readonly imageId: string;
    readonly shortDescription: string;
    readonly fullDescription: string;
    readonly behavior: EvidenceBehavior;
    readonly detailImageId?: string;
    readonly isInitiallyHidden: boolean;
    readonly switchConditionId?: string;
    readonly metadata: Record<string, any>;

    constructor(
        customId: string,
        name: string,
        type: string,
        imageId: string,
        shortDescription: string,
        fullDescription: string,
        behavior: EvidenceBehavior = EvidenceBehavior.NONE,
        detailImageId?: string,
        isInitiallyHidden: boolean = false,
        switchConditionId?: string,
        metadata: Record<string, any> = {}
    ) {
        this.uuid = uuidv4();
        this.customId = customId;
        this.name = name;
        this.type = type;
        this.imageId = imageId;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.behavior = behavior;
        this.detailImageId = detailImageId;
        this.isInitiallyHidden = isInitiallyHidden;
        this.switchConditionId = switchConditionId;
        this.metadata = metadata;
    }

    /**
     * Creates a new Evidence with updated properties
     * @param updates Object containing property updates
     * @returns A new Evidence with updated properties
     */
    update(updates: Partial<Omit<Evidence, 'uuid'>>): Evidence {
        return new Evidence(
            updates.customId ?? this.customId,
            updates.name ?? this.name,
            updates.type ?? this.type,
            updates.imageId ?? this.imageId,
            updates.shortDescription ?? this.shortDescription,
            updates.fullDescription ?? this.fullDescription,
            updates.behavior ?? this.behavior,
            updates.detailImageId ?? this.detailImageId,
            updates.isInitiallyHidden ?? this.isInitiallyHidden,
            updates.switchConditionId ?? this.switchConditionId,
            updates.metadata ?? this.metadata
        );
    }

    /**
     * Checks if this evidence is initially visible in the court record
     */
    isInitiallyVisible(): boolean {
        return !this.isInitiallyHidden;
    }

    /**
     * Checks if the evidence has detail behavior (document or photo)
     */
    hasDetailBehavior(): boolean {
        return this.behavior !== EvidenceBehavior.NONE;
    }

    /**
     * Serializes the object to JSON
     */
    toJSON(): object {
        return {
            uuid: this.uuid,
            customId: this.customId,
            name: this.name,
            type: this.type,
            imageId: this.imageId,
            shortDescription: this.shortDescription,
            fullDescription: this.fullDescription,
            behavior: this.behavior,
            detailImageId: this.detailImageId,
            isInitiallyHidden: this.isInitiallyHidden,
            switchConditionId: this.switchConditionId,
            metadata: this.metadata
        };
    }

    /**
     * Creates an Evidence from a JSON object
     */
    static fromJSON(json: any): Evidence {
        return new Evidence(
            json.customId,
            json.name,
            json.type,
            json.imageId,
            json.shortDescription,
            json.fullDescription,
            json.behavior,
            json.detailImageId,
            json.isInitiallyHidden,
            json.switchConditionId,
            json.metadata || {}
        );
    }
}
