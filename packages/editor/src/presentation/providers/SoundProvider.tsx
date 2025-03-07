import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Howl, Howler } from 'howler';

/**
 * Interface for sound configuration
 */
interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  loopStart?: number;
  loopEnd?: number;
}

/**
 * Interface for currently loaded sounds
 */
interface SoundMap {
  [key: string]: Howl;
}

/**
 * Interface for playing sound options
 */
interface PlayOptions {
  volume?: number;
  loop?: boolean;
  loopStart?: number;
  loopEnd?: number;
  onEnd?: () => void;
}

/**
 * Interface for the sound context
 */
interface SoundContextType {
  play: (key: string, options?: PlayOptions) => string | null;
  playOneShot: (src: string, options?: PlayOptions) => string | null;
  stop: (id?: string) => void;
  pause: (id?: string) => void;
  resume: (id?: string) => void;
  setVolume: (volume: number, id?: string) => void;
  preload: (key: string, config: SoundConfig) => void;
  unload: (key: string) => void;
  setMasterVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

// Create the context with default values
const SoundContext = createContext<SoundContextType>({
  play: () => null,
  playOneShot: () => null,
  stop: () => {},
  pause: () => {},
  resume: () => {},
  setVolume: () => {},
  preload: () => {},
  unload: () => {},
  setMasterVolume: () => {},
  isMuted: false,
  toggleMute: () => {},
});

/**
 * Hook for using the sound context
 */
export const useSound = () => useContext(SoundContext);

interface SoundProviderProps {
  children: ReactNode;
}

/**
 * Sound provider component for managing audio playback
 */
export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [sounds, setSounds] = useState<SoundMap>({});
  const [isMuted, setIsMuted] = useState(false);
  const [currentBgmId, setCurrentBgmId] = useState<string | null>(null);

  // Restore volume settings from localStorage
  useEffect(() => {
    const storedMute = localStorage.getItem('hedgewright_muted');
    const storedVolume = localStorage.getItem('hedgewright_volume');

    if (storedMute) {
      setIsMuted(storedMute === 'true');
    }

    if (storedVolume) {
      Howler.volume(parseFloat(storedVolume));
    }
  }, []);

  // Preload a sound
  const preload = (key: string, config: SoundConfig) => {
    if (sounds[key]) {
      console.warn(`Sound ${key} already loaded. Unload first to replace.`);
      return;
    }

    const sound = new Howl({
      src: [config.src],
      volume: config.volume || 1,
      loop: config.loop || false,
      preload: true,
      sprite: config.loopStart !== undefined && config.loopEnd !== undefined ? {
        loop: [config.loopStart * 1000, (config.loopEnd - config.loopStart) * 1000, true]
      } : undefined,
    });

    setSounds((prev) => ({
      ...prev,
      [key]: sound,
    }));
  };

  // Unload a sound
  const unload = (key: string) => {
    if (!sounds[key]) return;

    sounds[key].unload();
    setSounds((prev) => {
      const newSounds = { ...prev };
      delete newSounds[key];
      return newSounds;
    });
  };

  // Play a preloaded sound
  const play = (key: string, options?: PlayOptions): string | null => {
    const sound = sounds[key];
    if (!sound) {
      console.error(`Sound ${key} not loaded`);
      return null;
    }

    // Apply options
    if (options?.volume !== undefined) {
      sound.volume(options.volume);
    }

    if (options?.loop !== undefined) {
      sound.loop(options.loop);
    }

    // Handle BGM
    if (key.startsWith('bgm_') && currentBgmId && currentBgmId !== key) {
      sounds[currentBgmId].stop();
    }

    if (key.startsWith('bgm_')) {
      setCurrentBgmId(key);
    }

    // Play the sound
    const id = sound.play();

    // Set callback
    if (options?.onEnd) {
      sound.once('end', options.onEnd, id);
    }

    return id.toString();
  };

  const playOneShot = (src: string, options?: PlayOptions): string | null => {
    const sound = new Howl({
      src: [src],
      volume: options?.volume || 1,
      loop: options?.loop || false,
      onend: options?.onEnd,
      sprite: options?.loopStart !== undefined && options?.loopEnd !== undefined ? {
        loop: [options.loopStart * 1000, (options.loopEnd - options.loopStart) * 1000, true]
      } : undefined,
    });

    const id = sound.play();
    return id.toString();
  };

  // Stop playback
  const stop = (id?: string) => {
    if (id) {
      const [key, soundId] = id.split(':');
      if (sounds[key]) {
        sounds[key].stop(parseInt(soundId));
      }
    } else {
      // Stop all sounds
      Object.values(sounds).forEach((sound) => sound.stop());
    }
  };

  // Pause playback
  const pause = (id?: string) => {
    if (id) {
      const [key, soundId] = id.split(':');
      if (sounds[key]) {
        sounds[key].pause(parseInt(soundId));
      }
    } else {
      // Pause all sounds
      Object.values(sounds).forEach((sound) => sound.pause());
    }
  };

  // Resume playback
  const resume = (id?: string) => {
    if (id) {
      const [key, soundId] = id.split(':');
      if (sounds[key]) {
        sounds[key].play(parseInt(soundId));
      }
    } else {
      // Resume all sounds
      Object.values(sounds).forEach((sound) => sound.play());
    }
  };

  // Set volume for specific sound or id
  const setVolume = (volume: number, id?: string) => {
    if (id) {
      const [key, soundId] = id.split(':');
      if (sounds[key]) {
        sounds[key].volume(volume, parseInt(soundId));
      }
    } else {
      // Set volume for all sounds
      Object.values(sounds).forEach((sound) => sound.volume(volume));
    }
  };

  // Set master volume
  const setMasterVolume = (volume: number) => {
    Howler.volume(volume);
    localStorage.setItem('hedgewright_volume', volume.toString());
  };

  // Toggle mute
  const toggleMute = () => {
    const newMuted = !isMuted;
    Howler.mute(newMuted);
    setIsMuted(newMuted);
    localStorage.setItem('hedgewright_muted', newMuted.toString());
  };

  return (
    <SoundContext.Provider
      value={{
        play,
        playOneShot,
        stop,
        pause,
        resume,
        setVolume,
        preload,
        unload,
        setMasterVolume,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export default SoundProvider;
