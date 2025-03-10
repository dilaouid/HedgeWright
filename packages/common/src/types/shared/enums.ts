/**
 * Shared enumerations used across the editor and game engine
 */

export enum TextEffectType {
  COLOR = "color",
  FLASH = "flash",
  SHAKE = "shake",
  SOUND = "sound",
  WAIT = "wait",
  ICON = "icon",
  AUTO_CONTINUE = "auto_continue",
  TOGGLE_SPEAKING = "toggle_speaking"
}

export enum EventType {
  UNLOCK_EVIDENCE = "unlock_evidence",
  HIDE_EVIDENCE = "hide_evidence",
  UNLOCK_PROFILE = "unlock_profile",
  HIDE_PROFILE = "hide_profile",
  PLAY_SOUND = "play_sound",
  PLAY_MUSIC = "play_music",
  STOP_MUSIC = "stop_music",
  PAUSE_MUSIC = "pause_music",
  RESUME_MUSIC = "resume_music",
  PLAY_AMBIENT = "play_ambient",
  PLAY_ANIMATION = "play_animation",
  SHOW_HEALTH_BAR = "show_health_bar",
  HIDE_HEALTH_BAR = "hide_health_bar",
  FLASH_HEALTH_BAR = "flash_health_bar",
  MODIFY_HEALTH = "modify_health",
  SET_SWITCH = "set_switch",
  UNLOCK_SCENE = "unlock_scene",
  HIDE_SCENE = "hide_scene",
  WAIT = "wait",
  DISPLAY_BUBBLE = "display_bubble",
  FADE_OUT = "fade_out",
  FADE_IN = "fade_in",
  SHOW_SAVE_MENU = "show_save_menu",
  TRANSITION_TO_DIALOGUE = "transition_to_dialogue",
  TRANSITION_TO_MESSAGE = "transition_to_message",
  GROUP_CONTAINER = "group_container"
}

export enum EvidenceBehavior {
  DOCUMENT = "document",
  PHOTO = "photo",
  NONE = "none"
}

export enum AssetType {
  IMAGE = "image",
  SPRITE = "sprite",
  ANIMATION = "animation",
  SOUND = "sound"
}

export enum MusicType {
  BGM = "bgm",
  SFX = "sfx",
  VOICE = "voice"
}

export enum TimelineItemType {
  SCENE = "scene",
  MESSAGE = "message",
  CROSS_EXAMINATION = "cross_examination",
  DIALOGUE = "dialogue"
}

export enum BubbleType {
  OBJECTION = "objection",
  HOLD_IT = "hold_it",
  TAKE_THAT = "take_that",
  CUSTOM = "custom"
}

export enum MessagePosition {
  CENTER = "center",
  DEFAULT = "default"
}

export enum VoiceType {
  DEFAULT = 'default',
  MALE = 'male',
  FEMALE = 'female',
  SYSTEM = 'system',
  NONE = 'none'
}