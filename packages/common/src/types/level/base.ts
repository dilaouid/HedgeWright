export interface BaseSerializedModel {
  uuid: string;
  metadata: Record<string, unknown>;
}

export interface BaseSerializedNamedModel extends BaseSerializedModel {
  customId: string;
  name: string;
}

export interface BaseSerializedPositionedModel extends BaseSerializedModel {
  position: number;
}

export interface SerializedLevel extends BaseSerializedModel {
  title: string;
  author: string;
  description: string;
  version: string;
  gameOverDialogueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LevelMetadata {
  title: string;
  author: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
} 