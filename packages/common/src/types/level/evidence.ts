import { BaseSerializedNamedModel } from './base';
import { EvidenceBehavior } from '../shared/enums';

export interface SerializedEvidence extends BaseSerializedNamedModel {
  type: string;
  imageId: string;
  shortDescription: string;
  fullDescription: string;
  behavior: EvidenceBehavior;
  detailImageId?: string;
  isInitiallyHidden: boolean;
  switchConditionId?: string;
}

export interface SerializedDocument extends BaseSerializedNamedModel {
  content: string;
  evidenceId: string;
  page: number;
}

export interface SerializedProfile extends BaseSerializedNamedModel {
  age: string;
  gender: string;
  imageId: string;
  description: string;
  isInitiallyHidden: boolean;
  switchConditionId?: string;
} 