/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, Coffee, Zap } from 'lucide-react';
import { PomodoroMode } from '../types';
import { playFocusToBreak, playBreakToFocus } from '../lib/AudioEngine';

interface PomodoroProps {
  bgmPlaying: boolean;
  userMutedBgm: boolean;
  setBgmPlaying: (playing: boolean) => void;
  onSessionIncrement: () => void;
}

export function Pomodoro({ bgmPlaying, userMutedBgm, setBgmPlaying, onSessionIncrement }: PomodoroProps) {
  // Cycle configuration: 50 minutes Focus (3000s) and 10 minutes Break (600s)
  const FOCUS_TIME = 50 * 60;
  const BREAK_TIME = 10 * 60;

  const [mode, setMode] = useState<PomodoroMode>('집중');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  
  // To track whether BGM was playing before we forced it to pause due to break
  const wasBgmPlayingBeforeBreak = useRef(false);
  // Time travel multiplier for testing convenience
  const [isFastMode, setIsFastMode] = useState(false);

  // Core countdown runner
  useEffect(() => {
    let timerId: number | null = null;

    if (isRunning) {
      timerId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Reached zero: Trigger transition!
            handleTransition();
            return 0;
          }
          return prev - 1;
        });
      }, isFastMode ? 25 : 1000); // 40x speed-up in fast mode for testing transitions
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, mode, isFastMode, bgmPlaying, userMutedBgm]);

  // Handle phase transition triggers
  const handleTransition = () => {
    if (mode === '집중') {
      // Focus complete -> Break start
      playFocusToBreak();
      onSessionIncrement(); // Increment session count
      
      // BGM auto-relation rule: Pause BGM upon resting
      if (bgmPlaying) {
        wasBgmPlayingBeforeBreak.current = true;
        setBgmPlaying(false);
      } else {
        wasBgmPlayingBeforeBreak.current = false;
      }

      setMode('휴식');
      setTimeLeft(BREAK_TIME);
    } else {
      // Break complete -> Focus start
      playBreakToFocus();
      
      // BGM auto-relation rule: Resume BGM if it was playing and user hasn't active-paused it
      if (wasBgmPlayingBeforeBreak.current && !userMutedBgm) {
        setBgmPlaying(true);
      }
      wasBgmPlayingBeforeBreak.current = false;

      setMode('집중');
      setTimeLeft(FOCUS_TIME);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === '집중' ? FOCUS_TIME : BREAK_TIME);
  };

  const skipPhase = () => {
    handleTransition();
  };

  // Convert time to MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // UI styling based on Mode
  const isFocus = mode === '집중';
  const themeBgColor = isFocus 
    ? 'bg-[#FFEBEE] text-ac-pink' // Warm coral/pink pastel
    : 'bg-[#E0F2F1] text-[#004D40]'; // Warm baby blue/mint pastel
  
  const themeCardBorder = 'border-white';
  const mascotEmoji = isFocus ? '🍅' : '🍊';
  const statusColor = isFocus ? 'bg-ac-pink text-white' : 'bg-ac-blue text-white';

  return (
    <section className={`rounded-[3rem] border border-white shadow-sm p-6 flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden ${themeBgColor}`}>
      {/* Background Watermark */}
      <span className="absolute -bottom-6 -left-6 text-7xl select-none opacity-15 filter drop-shadow">
        {mascotEmoji}
      </span>
      
      {/* Title Segment */}
      <div className="flex items-center gap-2 mb-4 self-start select-none w-full justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-ac-brown/10">
            <span className="text-base">🍅</span>
          </div>
          <h2 className="text-lg font-bold text-ac-brown">
            토마토 집중 타이머 <span className="text-sm font-normal text-ac-brown/60">Pomodoro</span>
          </h2>
        </div>
      </div>

      {/* Main Clock Card content */}
      <div className="w-full flex flex-col md:flex-row items-center gap-6 py-4">
        {/* Playful Interactive Mascot Graphic */}
        <div className="flex flex-col items-center justify-center relative w-32 h-32 select-none group">
          {/* Animated pulsing base shadow */}
          <div className={`absolute bottom-1 w-20 h-4 bg-ac-brown/5 rounded-full transition-all duration-300 ${isRunning ? 'scale-105 opacity-40' : 'scale-95 opacity-20'}`}></div>
          
          {/* Main animated mascot figure */}
          <div 
            className={`w-24 h-24 rounded-full border border-ac-brown/10 flex flex-col items-center justify-center relative bg-white transition-all duration-300 ${
              isRunning ? 'animate-cute-float shadow-xl scale-102' : 'scale-95'
            } ${isFocus ? 'bg-[#FFF7F6]' : 'bg-[#F2FBFF]'}`}
            style={{ backgroundColor: '#fa7c7c' }}
          >
            
            {/* Tomato leaf/stem lid */}
            <div className="absolute top-[-10px] text-3xl select-none leading-none z-10 transform hover:rotate-12 transition-transform">
              {isFocus ? '🍃' : '🍀'}
            </div>

            {/* Mascot Face */}
            <div className="flex flex-col items-center justify-center mt-3">
              <div className="flex gap-4">
                {/* Eyes */}
                <div className="w-3 h-3 rounded-full bg-ac-brown flex items-center justify-center relative">
                  <div className="w-1 h-1 rounded-full bg-white absolute top-0.5 right-0.5"></div>
                </div>
                <div className="w-3 h-3 rounded-full bg-ac-brown flex items-center justify-center relative">
                  <div className="w-1 h-1 rounded-full bg-white absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              
              {/* Cute soft blush cheeks */}
              <div className="flex justify-between w-14 -mt-1.5 px-1.5">
                <div 
                  className="bg-[#FF8A80] rounded-full opacity-60 animate-pulse"
                  style={{ width: '5px', height: '3px' }}
                ></div>
                <div 
                  className="bg-[#FF8A80] rounded-full opacity-60 animate-pulse"
                  style={{ width: '5px', height: '3px' }}
                ></div>
              </div>
              
              {/* Smile Mouth */}
              <div 
                className="border-b-2 border-ac-brown rounded-b-full -mt-0.5 transition-all"
                style={{ width: '15px', height: '7px' }}
              ></div>
            </div>
            
            {/* Star badge on body */}
          </div>
          
          {/* Flying note indicators on running BGM */}
          {isRunning && (
            <>
              <div className="absolute top-1 left-2 text-sm animate-bounce text-ac-orange delay-100 font-bold select-none">🎵</div>
              <div className="absolute bottom-4 right-1 text-xs animate-pulse text-ac-mint font-bold select-none">✨</div>
            </>
          )}
        </div>

        {/* Clock Text & Controllers */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Mode Badge Indicator */}
          <div className="flex items-center gap-1.5 mb-1.5 select-none text-ac-brown">
            <span 
              className={`text-xs font-black px-3.5 py-1 rounded-full border border-white shadow-sm flex items-center gap-1 ${statusColor}`}
              style={{ backgroundColor: '#f7d9a4' }}
            >
              {isFocus ? <Award className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
              {mode} 모드
            </span>
          </div>

          {/* Time digits display */}
          <p className="text-5xl md:text-6xl font-extrabold text-ac-brown font-bubbly tracking-tight mb-4 select-none">
            {formatTimer(timeLeft)}
          </p>

          {/* Interactive controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartPause}
              className={`ac-btn-push rounded-full border border-white/40 shadow-sm px-6 py-2.5 font-black text-sm flex items-center gap-1.5 transition-all text-white cursor-pointer ${
                isRunning ? 'bg-ac-orange hover:bg-ac-orange/90' : 'bg-ac-mint hover:bg-ac-mint/95'
              }`}
              style={{ backgroundColor: '#91b79d' }}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 text-white fill-white stroke-[3]" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white stroke-[3]" />
                  <span>집중하기</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              aria-label="타이머 리셋"
              title="시간 되돌리기"
              className="w-10 h-10 rounded-full border border-[#F0E6D2] bg-white flex items-center justify-center shadow-sm ac-btn-push cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-ac-brown" />
            </button>

            {/* Manual Skip Travel Button */}
            <button
              onClick={skipPhase}
              className="text-xs font-bold text-ac-brown/60 hover:text-ac-brown bg-white/60 hover:bg-white/95 border border-white/50 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              title="다음 단계로 강제 전환"
            >
              건너뛰기 🐾
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
