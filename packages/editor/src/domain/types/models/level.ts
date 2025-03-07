import { BaseModel } from './base';
import { Dialogue } from './dialogue';

export interface Level extends BaseModel {
  title: string;
  author: string;
  description: string;
  version: string;
  gameOverDialogue: Dialogue; 
  createdAt: Date;
  updatedAt: Date;
}

// Repository interface
export interface LevelRepository {
  findById(id: string): Promise<Level | null>;
  save(level: Level): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<Level[]>;
} 