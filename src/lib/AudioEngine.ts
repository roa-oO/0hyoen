/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BgmTrackId } from '../types';

let audioCtx: AudioContext | null = null;
let activeBgm: HTMLAudioElement | null = null;

export const BGM_TRACK_URLS: Record<Exclude<BgmTrackId, 'none'>, string> = {
  track1: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track1.mp3',
  track2: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track2.mp3',
  track3: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track3.mp3',
  track4: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track4.mp3',
  track5: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track5.mp3',
  track6: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track6.mp3',
  track7: 'https://k7imwlr1bqnlc6nu.public.blob.vercel-storage.com/track7.mp3',
};

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Create audio context on user interaction
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Focus -> Break Sound (523Hz -> 659Hz, 0.35s each, sequential)
export function playFocusToBreak() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Tone 1: C5 (523Hz)
    playTone(523.25, 0.35, now, ctx);
    
    // Tone 2: E5 (659Hz) starting 0.35s later
    playTone(659.25, 0.35, now + 0.35, ctx);
  } catch (error) {
    console.error('Failed to play transition sound:', error);
  }
}

// 2. Break -> Focus Sound (440Hz, 0.5s, single tone, fade out)
export function playBreakToFocus() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(440.00, 0.50, now, ctx);
  } catch (error) {
    console.error('Failed to play transition sound:', error);
  }
}

// Prompt-compliant tone player: plays a frequency with an exponential ramp to 0
export function playTone(freq: number, duration: number, startTime: number, ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.45, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function startBgm(type: BgmTrackId) {
  stopAllBgm();

  if (type === 'none') return;

  const audio = new Audio(BGM_TRACK_URLS[type]);
  audio.loop = true;
  audio.volume = 0.5;
  activeBgm = audio;

  void audio.play().catch(error => {
    console.error('Failed to play BGM track:', error);
  });
}

export function stopAllBgm() {
  if (!activeBgm) return;

  activeBgm.pause();
  activeBgm.currentTime = 0;
  activeBgm = null;
}
