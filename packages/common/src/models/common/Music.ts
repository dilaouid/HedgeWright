/**
 * Music model
 * Represents audio assets in the game (BGM, SFX, voices, etc.)
 */
import { v4 as uuidv4 } from 'uuid';
import { MusicType } from '../../types';

export class Music {
  readonly uuid: string;
  readonly customId: string;
  readonly name: string;
  readonly path: string;
  readonly musicType: MusicType;
  readonly volume: number;
  readonly loop: boolean;
  readonly metadata: Record<string, any>;

  constructor(
    customId: string,
    name: string,
    path: string,
    musicType: MusicType,
    volume: number = 1,
    loop: boolean = false,
    metadata: Record<string, any> = {}
  ) {
    this.uuid = uuidv4();
    this.customId = customId;
    this.name = name;
    this.path = path;
    this.musicType = musicType;
    this.volume = volume;
    this.loop = loop;
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
      updates.volume ?? this.volume,
      updates.loop ?? this.loop,
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
    return this.musicType === MusicType.SFX;
  }

  /**
   * Checks if this is a voice clip
   */
  isVoice(): boolean {
    return this.musicType === MusicType.VOICE;
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
      volume: this.volume,
      loop: this.loop,
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
      json.volume,
      json.loop,
      json.metadata || {}
    );
  }
}