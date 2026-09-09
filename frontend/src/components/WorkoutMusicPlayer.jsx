import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  AlertCircle,
  Headphones,
} from 'lucide-react';
import { Card, Badge } from './ui';

// Free background / motivational workout tracks
// MP3 files reside in frontend/public/audio/
const TRACKS = [
  { name: 'Upbeat Energy', src: '/audio/track1.mp3' },
  { name: 'Focus Flow', src: '/audio/track2.mp3' },
  { name: 'Power Beat', src: '/audio/track3.mp3' },
];

const WorkoutMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentTrack = TRACKS[currentTrackIndex];

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Safe play handler
  const playTrack = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      setHasError(false);
      setErrorMessage('');
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('[WorkoutMusicPlayer] Playback error or missing file:', err.message);
      setIsPlaying(false);
      setHasError(true);
      setErrorMessage('Track unavailable (place .mp3 files in public/audio)');
    }
  }, []);

  // Safe pause handler
  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  // Next track
  const handleNext = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  // Previous track
  const handlePrev = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  // If track index changes and was playing, load and play new track
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        playTrack();
      }
    }
  }, [currentTrackIndex, isPlaying, playTrack]);

  // Mute / unmute
  const toggleMute = () => {
    if (isMuted) {
      const restored = prevVolume > 0 ? prevVolume : 0.7;
      setVolume(restored);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  // Volume slider change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    } else if (val === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  // Audio event listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setHasError(false);
    }
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setHasError(true);
    setErrorMessage('Track unavailable (place .mp3 in public/audio)');
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <Card className="p-4 sm:p-5 border-cyan-500/20 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md transition-all shadow-sm">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        onError={handleAudioError}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Track Info & Visualizer */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              isPlaying
                ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <motion.span
                  className="w-1 bg-white rounded-full"
                  animate={{ height: ['40%', '100%', '60%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                />
                <motion.span
                  className="w-1 bg-white rounded-full"
                  animate={{ height: ['100%', '30%', '90%', '40%'] }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                />
                <motion.span
                  className="w-1 bg-white rounded-full"
                  animate={{ height: ['50%', '100%', '30%', '80%'] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                />
              </div>
            ) : (
              <Headphones className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm">
                Workout Beats
              </Badge>
              <span className="text-[11px] text-slate-400 font-medium">
                Track {currentTrackIndex + 1} of {TRACKS.length}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {currentTrack.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Playback Controls & Volume */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:justify-end">
          {/* Track Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Track"
              title="Previous Track"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause Workout Music' : 'Play Workout Music'}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Track"
              title="Next Track"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-white/5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume Slider"
              className="w-16 sm:w-20 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Quick Pause All / Mute Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={pauseTrack}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-300/40 dark:border-white/5 transition-colors cursor-pointer"
            >
              Pause All
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-3.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Error / Missing Track Notice */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WorkoutMusicPlayer;
