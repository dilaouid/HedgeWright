/**
 * Music model
 * Represents audio assets in the game (BGM, SFX, voices, etc.)
 */
import { v4 as uuidv4 } from 'uuid';
import { MusicType } from '../../types';

export interface LoopPoints {
  start: number;  // Start position in milliseconds
  end: number;    // End position in milliseconds
}

export class Music {
  readonly uuid: string;
  readonly customId: string;
  readonly name: string;
  readonly path: string;
  readonly musicType: MusicType;
  readonly duration: number; // In seconds
  readonly volume: number;
  readonly loop: boolean;
  readonly loopStartTime: number | null;
  readonly loopEndTime: number | null;
  readonly metadata: Record<string, any>;

  constructor(
    customId: string,
    name: string,
    path: string,
    musicType: MusicType,
    duration: number = 0,
    volume: number = 1,
    loop: boolean = false,
    loopStartTime: number | null = null,
    loopEndTime: number | null = null,
    metadata: Record<string, any> = {}
  ) {
    this.uuid = uuidv4();
    this.customId = customId;
    this.name = name;
    this.path = path;
    this.musicType = musicType;
    this.duration = duration;
    this.volume = volume;
    this.loop = loop;
    this.loopStartTime = loopStartTime;
    this.loopEndTime = loopEndTime;
    this.metadata = metadata;
  }

  /**
   * Returns a new Music with updated properties
   */
  update(updates: Partial<Omit<Music, 'uuid'>>): Music {
    return new Music(
      updates.customId ?? this.customId,
      updates.name ?? this.name,
      updates.path ?? this.path,
      updates.musicType ?? this.musicType,
      updates.duration ?? this.duration,
      updates.volume ?? this.volume,
      updates.loop ?? this.loop,
      updates.loopStartTime ?? this.loopStartTime,
      updates.loopEndTime ?? this.loopEndTime,
      updates.metadata ?? this.metadata
    );
  }

  /**
   * Checks if this is background music
   */
  isBackgroundMusic(): boolean {
    return this.musicType === MusicType.BGM;
  }

  /**
   * Checks if this is a sound effect
   */
  isSoundEffect(): boolean {
    return this.musicType === MusicType.SFX || this.musicType === MusicType.JINGLE;
  }

  /**
   * Checks if this is a voice clip
   */
  isVoice(): boolean {
    return this.musicType === MusicType.VOICE;
  }

  /**
   * Gets loop points as a structured object
   */
  getLoopPoints(): LoopPoints | null {
    if (this.loopStartTime !== null && this.loopEndTime !== null) {
      return {
        start: this.loopStartTime,
        end: this.loopEndTime
      };
    }
    return null;
  }

  /**
   * Converts to a JSON-serializable format
   */
  toJSON(): object {
    return {
      uuid: this.uuid,
      customId: this.customId,
      name: this.name,
      path: this.path,
      musicType: this.musicType,
      duration: this.duration,
      volume: this.volume,
      loop: this.loop,
      loopStartTime: this.loopStartTime,
      loopEndTime: this.loopEndTime,
      metadata: this.metadata
    };
  }

  /**
   * Creates a Music instance from JSON data
   */
  static fromJSON(json: any): Music {
    return new Music(
      json.customId,
      json.name,
      json.path,
      json.musicType,
      json.duration,
      json.volume,
      json.loop,
      json.loopStartTime,
      json.loopEndTime,
      json.metadata || {}
    );
  }
}