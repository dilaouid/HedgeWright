import { BaseSerializedNamedModel } from './base';
import { AssetType, MusicType } from '../shared/enums';

export interface SerializedAsset extends BaseSerializedNamedModel {
  type: AssetType;
  path: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface SerializedMusic extends BaseSerializedNamedModel {
  path: string;
  musicType: MusicType;
  duration: number;
  volume: number;
  loop: boolean;
  loopStartTime?: number;
  loopEndTime?: number;
} 