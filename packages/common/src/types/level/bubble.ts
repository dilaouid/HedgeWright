import { BaseSerializedModel, BaseSerializedNamedModel } from './base';
import { BubbleType } from '../shared/enums';

export interface SerializedBubbleSet extends BaseSerializedNamedModel {
}

export interface SerializedBubble extends BaseSerializedNamedModel {
  bubbleSetId: string;
  type: BubbleType;
  animationId: string;
  soundId: string;
}

export interface SerializedMessageBubble extends BaseSerializedModel {
  beforeMessageId?: string;
  afterMessageId?: string;
  dialogueId?: string;
  bubbleId: string;
} 