import { BaseSerializedModel } from './base';
import { TextEffectType } from '../shared/enums';

export interface SerializedTextSegment extends BaseSerializedModel {
  messageId: string;
  text: string;
  startIndex: number;
  endIndex: number;
  position: number;
}

export interface SerializedTextEffect extends BaseSerializedModel {
  textSegmentId: string;
  type: TextEffectType;
  value: string;
  startDelay: number;
  duration?: number;
  intensity?: number;
} 