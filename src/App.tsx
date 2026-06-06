/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Checklist } from './components/Checklist';
import { Memo } from './components/Memo';
import { Pomodoro } from './components/Pomodoro';
import { SessionStats, SessionStatsRef } from './components/SessionStats';
import { Shortcuts } from './components/Shortcuts';
import { BgmPlayer } from './components/BgmPlayer';
import { BgmTrackId } from './types';
import { startBgm, stopAllBgm, getAudioContext } from './lib/AudioEngine';

export default function App() {
  // Sync state for BGM
  const [bgmTrack, setBgmTrack] = useState<BgmTrackId>('none');
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);
  const [userMutedBgm, setUserMutedBgm] = useState<boolean>(false);

  // Ref to trigger session logs in the SessionStats component
  const sessionStatsRef = useRef<SessionStatsRef>(null);

  // Synchronize Blob-backed BGM tracks
  useEffect(() => {
    if (bgmPlaying && bgmTrack !== 'none') {
      startBgm(bgmTrack);
    } else {
      stopAllBgm();
    }
    return () => {
      stopAllBgm();
    };
  }, [bgmTrack, bgmPlaying]);

  // Lazy enable audio context on general tap, resolving browser sandbox constraints
  const initAudioOnTouch = () => {
    try {
      getAudioContext();
    } catch (e) {}
  };

  const handleSessionIncrement = () => {
    if (sessionStatsRef.current) {
      sessionStatsRef.current.increment();
    }
  };

  return (
    <div 
      onClick={initAudioOnTouch}
      className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8 select-none"
      style={{
        backgroundColor: '#EBF7F2', // Soft pristine mint/sage background
        backgroundImage: `
          radial-gradient(#D3E9DF 12%, transparent 12%), 
          radial-gradient(#D3E9DF 12%, transparent 12%)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px'
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Top Header Section */}
        <Header />

        {/* Responsive Layout Grid
            - Mobile: 1 Column flex vertical
            - XL Desktop (>= 1280px): strict 3-column responsive layout (3fr:4fr:3fr) with 16px gap as requested
        */}
        <main className="grid grid-cols-1 xl:grid-cols-10 gap-4 mt-1">
          {/* Left Column (Clorophyll Column - Checklist & Notepad) - Span 3 */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="h-auto">
              <Checklist />
            </div>
            <div className="flex-1">
              <Memo />
            </div>
          </div>

          {/* Central Column (Focus Hub - Pomodoro, Stats & Shortcuts) - Span 4 */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <Pomodoro 
              bgmPlaying={bgmPlaying} 
              userMutedBgm={userMutedBgm} 
              setBgmPlaying={setBgmPlaying}
              onSessionIncrement={handleSessionIncrement}
            />
            <SessionStats ref={sessionStatsRef} />
            <Shortcuts />
          </div>

          {/* Right Column (Acoustic radio Station) - Span 3 */}
          <div className="xl:col-span-3 h-full">
            <BgmPlayer
              track={bgmTrack}
              playing={bgmPlaying}
              userMuted={userMutedBgm}
              setTrack={setBgmTrack}
              setPlaying={setBgmPlaying}
              setUserMuted={setUserMutedBgm}
            />
          </div>
        </main>
      </div>

      {/* Decorative footer credits */}
      <footer className="max-w-7xl mx-auto mt-10 text-center select-none text-[11px] font-black tracking-wider text-ac-brown/35 uppercase">
        <span>🏡 숲속의 작은 생산성 공간 • Crafted with love 🍃</span>
      </footer>
    </div>
  );
}
