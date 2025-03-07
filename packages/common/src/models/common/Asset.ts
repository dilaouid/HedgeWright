/**
 * Base Asset model
 * Represents any reusable resource (image, sound, etc.) in the game
 */
import { v4 as uuidv4 } from 'uuid';
import { AssetType } from '../../types';

export class Asset {
  readonly uuid: string;
  readonly customId: string;
  readonly name: string;
  readonly type: AssetType;
  readonly path: string;
  readonly size: number;
  readonly mimeType: string;
  readonly metadata: Record<string, any>;

  constructor(
    customId: string,
    name: string,
    type: AssetType,
    path: string,
    size: number = 0,
    mimeType: string = '',
    metadata: Record<string, any> = {}
  ) {
    this.uuid = uuidv4();
    this.customId = customId;
    this.name = name;
    this.type = type;
    this.path = path;
    this.size = size;
    this.mimeType = mimeType;
    this.metadata = metadata;
  }

  /**
   * Returns a new asset with updated properties
   */
  update(updates: Partial<Omit<Asset, 'uuid'>>): Asset {
    return new Asset(
      updates.customId ?? this.customId,
      updates.name ?? this.name,
      updates.type ?? this.type,
      updates.path ?? this.path,
      updates.size ?? this.size,
      updates.mimeType ?? this.mimeType,
      updates.metadata ?? this.metadata
    );
  }

  /**
   * Converts to a JSON-serializable format
   */
  toJSON(): object {
    return {
      uuid: this.uuid,
      customId: this.customId,
      name: this.name,
      type: this.type,
      path: this.path,
      size: this.size,
      mimeType: this.mimeType,
      metadata: this.metadata
    };
  }

  /**
   * Creates an Asset instance from JSON data
   */
  static fromJSON(json: any): Asset {
    return new Asset(
      json.customId,
      json.name,
      json.type,
      json.path,
      json.size,
      json.mimeType,
      json.metadata || {}
    );
  }
}