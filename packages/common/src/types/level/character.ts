import { BaseSerializedModel, BaseSerializedNamedModel } from './base';

export interface SerializedCharacter extends BaseSerializedNamedModel {
  profileId?: string;
}

export interface SerializedCharacterState extends BaseSerializedModel {
  characterId: string;
  name: string;
  idleAnimationId?: string;
  talkingAnimationId?: string;
  specialAnimationId?: string;
  specialSoundId?: string;
  specialSoundDelay: number;
} 