import { BaseSerializedNamedModel } from './base';

export interface SerializedScene extends BaseSerializedNamedModel {
  backgroundId: string;
  isDoubleScreen: boolean;
  characterId?: string;
  characterPosition?: string;
  introDialogueId?: string;
  conclusionDialogueId?: string;
  conclusionDialogueSwitchId?: string;
  switchConditionId?: string;
  defaultErrorExaminationDialogueId?: string;
  position: number;
}

export interface SerializedExaminableArea extends BaseSerializedNamedModel {
  sceneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dialogueId: string;
}

export interface SerializedSceneTransition extends BaseSerializedNamedModel {
  previewImageId?: string;
  useDefaultPreview: boolean;
  showUnvisitedEffect: boolean;
  sourceSceneId: string;
  targetSceneId: string;
  label: string;
  switchConditionId?: string;
  position: number;
} 