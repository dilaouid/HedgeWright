import { BaseNamedModel, BasePositionedModel } from './base';
import { MessagePosition, Asset } from '@hedgewright/common';
import { Character } from '@/domain/models/characters/Character';
import { TextSegment } from '@/domain/models/messages/TextSegment';

export interface Message extends BaseNamedModel, BasePositionedModel {
  rawText: string;
  background: Asset; // Référence directe à l'asset
  character?: Character; // Référence directe au personnage
  characterState?: string;
  characterPosition?: string;
  speakerName?: string;
  showSpeakerName: boolean;
  typewritingSpeed: number;
  messagePosition: MessagePosition;
  nextMessage?: Message; // Référence directe au message suivant
  segments: TextSegment[]; // Référence directe aux segments
}

// Repository interface
export interface MessageRepository {
  findById(id: string): Promise<Message | null>;
  save(message: Message): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<Message[]>;
} 