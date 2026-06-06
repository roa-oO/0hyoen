/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type PomodoroMode = '집중' | '휴식';

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  cycleCount: number; // incremented only when Focus 50m finishes
}

export type BgmTrackId =
  | 'track1'
  | 'track2'
  | 'track3'
  | 'track4'
  | 'track5'
  | 'track6'
  | 'track7'
  | 'none';

export interface BgmTrack {
  id: BgmTrackId;
  name: string;
  emoji: string;
  description: string;
  colorClass: string;
}
