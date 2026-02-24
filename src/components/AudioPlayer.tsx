"use client";

import { useState, useRef, useEffect } from "react";

export type PlayCount = 1 | 3 | 5 | 10;

interface AudioPlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  /** Play full audio this many times (1, 3, 5, or 10). Only used when not in phrase mode. */
  playCount?: PlayCount;
  /** When set with endTime, play only this segment (phrase-synced playback) */
  startTime?: number;
  /** When set with startTime, stop playback at this time (seconds) */
  endTime?: number;
}

export function AudioPlayer({
  src,
  className = "",
  loop = false,
  playCount = 1,
  startTime,
  endTime,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  /** Set when user presses play: how many times to play in this session */
  const sessionPlayCountRef = useRef(1);
  /** How many full plays we've completed in this session */
  const playsDoneRef = useRef(0);
  const isPhraseMode =
    typeof startTime === "number" && typeof endTime === "number";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        // Drop session so next play starts fresh
        if (!isPhraseMode) {
          sessionPlayCountRef.current = 1;
          playsDoneRef.current = 0;
        }
      } else {
        if (isPhraseMode) {
          audio.currentTime = startTime!;
          setCurrentTime(startTime!);
        } else {
          // New session: start from beginning and set repeat count
          audio.currentTime = 0;
          setCurrentTime(0);
          sessionPlayCountRef.current = playCount;
          playsDoneRef.current = 0;
        }
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  // Phrase mode: reset to segment when src or segment changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPhraseMode) return;
    audio.pause();
    audio.currentTime = startTime!;
    setCurrentTime(startTime!);
    setIsPlaying(false);
  }, [src, startTime, endTime, isPhraseMode]);

  // Apply loop dynamically (only when not in phrase mode and not using playCount)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop && !isPhraseMode && playCount <= 1;
  }, [loop, isPhraseMode, playCount]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasError(false);
    setCurrentTime(isPhraseMode ? startTime! : 0);
    setDuration(isPhraseMode ? endTime! - startTime! : 0);
    setIsPlaying(false);
    // Only show loading if audio isn't ready yet (e.g. src changed). If only playCount changed, keep play button visible.
    if (audio.readyState < 2) {
      setIsLoading(true);
    }

    const handleTimeUpdate = () => {
      const t = audio.currentTime;
      setCurrentTime(t);
      if (isPhraseMode && t >= endTime!) {
        audio.pause();
        audio.currentTime = endTime!;
        setCurrentTime(endTime!);
        setIsPlaying(false);
      }
    };

    const handleDurationChange = () => {
      if (!isPhraseMode) setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isPhraseMode) return;
      const target = sessionPlayCountRef.current;
      if (target <= 1) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
      playsDoneRef.current += 1;
      if (playsDoneRef.current < target) {
        audio.currentTime = 0;
        setCurrentTime(0);
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      playsDoneRef.current = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        isPhraseMode ? endTime! - startTime! : audio.duration
      );
      setIsLoading(false);
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [src, loop, playCount, isPhraseMode, startTime, endTime]);

  const minTime = isPhraseMode ? startTime! : 0;
  const maxTime = isPhraseMode ? endTime! : duration || 100;
  const displayDuration = isPhraseMode ? endTime! - startTime! : duration;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (hasError) return null;

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-xl bg-[#e4dbe2]/40 p-4 ${className}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex w-full items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="tap-scale flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4dbe2] text-slate-700 transition-colors hover:bg-[#d9ced6] disabled:opacity-50"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <span className="text-sm text-slate-600">...</span>
          ) : isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="ml-1 h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            min={minTime}
            max={maxTime}
            value={currentTime}
            onChange={handleSeek}
            disabled={!isPhraseMode && playCount > 1}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#e4dbe2]/60 accent-[#e4dbe2] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#e4dbe2] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>
              {formatTime(
                isPhraseMode ? currentTime - startTime! : currentTime
              )}
            </span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}