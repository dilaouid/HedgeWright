import { BaseSerializedModel, BaseSerializedNamedModel } from './base';
import { MessagePosition } from '../shared/enums';

export interface SerializedDialogue extends BaseSerializedNamedModel {
  description?: string;
}

export interface SerializedMessage extends BaseSerializedNamedModel {
  rawText: string;
  backgroundId: string;
  characterId?: string;
  characterState?: string;
  characterPosition?: string;
  speakerName?: string;
  showSpeakerName: boolean;
  typewritingSpeed: number;
  messagePosition: MessagePosition;
  dialogueId?: string;
  nextMessageId?: string;
  position: number;
}

export interface SerializedDialogueChoice extends BaseSerializedModel {
  dialogueId: string;
  text: string;
  targetDialogueId?: string;
  targetMessageId?: string;
  switchConditionId?: string;
  position: number;
} 