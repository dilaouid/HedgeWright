import { BaseSerializedModel, BaseSerializedNamedModel } from './base';

export interface SerializedInvestigation extends BaseSerializedNamedModel {
  description?: string; // Text [null] dans le DBML
  position: number;
  switchConditionId?: string; // UUID [ref: > Switch.uuid, null] dans le DBML
}

export interface SerializedInvestigationScene extends BaseSerializedModel {
  investigationId: string; // UUID [ref: > Investigation.uuid] dans le DBML
  sceneId: string; // UUID [ref: > Scene.uuid] dans le DBML
  position: number;
  isInitialScene: boolean;
} 