export interface BaseModel {
  uuid: string;
  metadata?: Record<string, unknown>;
}

export interface BaseNamedModel extends BaseModel {
  customId: string;
  name: string;
}

export interface BasePositionedModel extends BaseModel {
  position: number;
} 