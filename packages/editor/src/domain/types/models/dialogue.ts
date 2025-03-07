import { BaseNamedModel } from './base';
import { Message } from './message';

export interface Dialogue extends BaseNamedModel {
  description?: string;
  messages: Message[];
}

// Repository interface
export interface DialogueRepository {
  findById(id: string): Promise<Dialogue | null>;
  save(dialogue: Dialogue): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<Dialogue[]>;
} 