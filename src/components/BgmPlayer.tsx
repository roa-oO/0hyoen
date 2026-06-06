/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play, Pause, Music, Volume2, HelpCircle } from 'lucide-react';
import { BgmTrackId, BgmTrack } from '../types';

interface BgmPlayerProps {
  track: BgmTrackId;
  playing: boolean;
  userMuted: boolean;
  setTrack: (id: BgmTrackId) => void;
  setPlaying: (playing: boolean) => void;
  setUserMuted: (muted: boolean) => void;
}

const BG_TRACKS: BgmTrack[] = [
  { 
    id: 'track1', 
    name: '승민이랑 도서관', 
    emoji: '📗', 
    description: '영현아 도서관 가는데 숟가락은 왜 가져가', 
    colorClass: 'bg-[#FFF8D4] border-[#FFDF65]'
  },
  { 
    id: 'track2', 
    name: '그래도 해내죠', 
    emoji: '☀️', 
    description: '회피하지 말고 PopSong들으면서 해피하게', 
    colorClass: 'bg-ac-mint-light border-ac-mint'
  },
  { 
    id: 'track3', 
    name: '다 시끄럽다', 
    emoji: '🙏', 
    description: 'ADHD의 흩어진 정신을 모으는 기도를 드릴게요', 
    colorClass: 'bg-ac-blue-light border-ac-blue'
  },
  { 
    id: 'track4', 
    name: '스테이는 한다', 
    emoji: '🖤', 
    description: '스키즈 노래 들으면서 공부 할 수 있잖아', 
    colorClass: 'bg-ac-orange/10 border-ac-orange'
  },
  { 
    id: 'track5', 
    name: '놀러와요 영현의집', 
    emoji: '💤', 
    description: '영현이 집에서 자는 낮잠 참 달다', 
    colorClass: 'bg-[#FFF8D4] border-[#FFDF65]'
  },
  { 
    id: 'track6', 
    name: '딸들이 응원해', 
    emoji: '🐳', 
    description: '엄마, 그릭요거트도 먹고 밥도 먹으면서 해', 
    colorClass: 'bg-ac-mint-light border-ac-mint'
  },
  { 
    id: 'track7', 
    name: '진짜 얏됐다', 
    emoji: '🎹', 
    description: '5시간 걸리는 일 50분 만에 끝내드려요', 
    colorClass: 'bg-ac-blue-light border-ac-blue'
  }
];

export function BgmPlayer({ track, playing, userMuted, setTrack, setPlaying, setUserMuted }: BgmPlayerProps) {
  const [volume, setVolume] = useState<number>(0.5);

  const handleTogglePlay = () => {
    if (track === 'none' && BG_TRACKS.length > 0) {
      setTrack(BG_TRACKS[0].id);
      setPlaying(true);
      setUserMuted(false);
    } else {
      const nextPlayingState = !playing;
      setPlaying(nextPlayingState);
      setUserMuted(!nextPlayingState);
    }
  };

  const handleSelectTrack = (trackId: BgmTrackId) => {
    setTrack(trackId);
    setPlaying(true);
    setUserMuted(false);
  };

  const rendersVisualizer = () => {
    const barsCount = 14;
    return (
      <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4 border border-ac-brown/5 bg-[#FDFBF7]/60 p-3.5 rounded-2xl relative select-none">
        {Array.from({ length: barsCount }).map((_, idx) => {
          const randomDuration = 0.5 + Math.random() * 0.8;
          const randomDelay = Math.random() * 0.4;
          return (
            <div
              key={idx}
              className="flex-1 rounded-full bg-ac-mint"
              style={{
                height: playing ? '100%' : '15%',
                transformOrigin: 'bottom',
                animation: playing 
                  ? `bounce ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate` 
                  : 'none',
                opacity: playing ? 0.9 : 0.35,
                transition: 'height 0.3s ease'
              }}
            />
          );
        })}
        {playing && (
          <style>{`
            @keyframes bounce {
              0% { transform: scaleY(0.2); }
              100% { transform: scaleY(1.0); }
            }
          `}</style>
        )}
        
        {!playing && (
          <span className="absolute text-[10px] font-black text-ac-brown/40 uppercase tracking-widest top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            Player Paused
          </span>
        )}
      </div>
    );
  };

  const activeTrackObj = BG_TRACKS.find(t => t.id === track);

  return (
    <section className="bg-ac-blue-light rounded-[3rem] border border-white shadow-sm p-6 flex flex-col h-full min-h-[500px] relative overflow-hidden group">
      <div className="absolute top-4 right-4 text-3xl select-none opacity-20 group-hover:opacity-100 transition-opacity animate-cute-float">
        🎧
      </div>

      <div className="flex items-center gap-2 mb-4 select-none">
        <div className="w-8 h-8 rounded-full bg-ac-pink-light flex items-center justify-center border border-ac-pink/20">
          <Music className="w-4 h-4 text-ac-pink" />
        </div>
        <h2 className="text-lg font-bold text-ac-brown flex items-center gap-1">
          오두막 라디오 <span className="text-sm font-normal text-ac-brown/60">BGM Station</span>
        </h2>
      </div>

      <div className="bg-white/95 border border-[#CCDCDA] rounded-[2rem] p-5 flex flex-col items-center shadow-sm mb-5 relative flex-1">
        <div className="absolute -top-1 ml-auto mr-auto w-32 h-2.5 bg-ac-brown/5 rounded-full border border-ac-brown/15"></div>

        <div className="w-28 h-28 rounded-full bg-ac-brown border border-white flex items-center justify-center relative my-4 shadow-sm group-hover:rotate-12 transition-transform">
          <div className="w-full h-full rounded-full border border-dashed border-white/20 absolute"></div>
          
          <div className={`w-12 h-12 rounded-full bg-ac-mint border border-white/20 flex items-center justify-center text-lg ${playing ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
            {activeTrackObj ? activeTrackObj.emoji : '📻'}
          </div>
          
          {playing && (
            <>
              <span className="absolute top-[-8px] right-2 text-base animate-bounce">🎶</span>
              <span className="absolute bottom-1 left-2 text-sm animate-pulse text-[#FFD54F]">✨</span>
            </>
          )}
        </div>

        <div className="text-center mb-4 select-none w-full">
          <p className="text-[10px] font-bold text-ac-mint uppercase tracking-wider mb-0.5">
            지금 흘러나오는 사운드
          </p>
          <h3 className="text-base font-black text-ac-brown leading-tight truncate">
            {activeTrackObj ? `${activeTrackObj.emoji} ${activeTrackObj.name}` : '잠시 꺼둠'}
          </h3>
          <p className="text-[11px] font-semibold text-ac-brown/55 px-4 mt-1 line-clamp-1 h-4">
            {activeTrackObj ? activeTrackObj.description : '듣고 싶은 소리를 아래에서 골라보세요!'}
          </p>
        </div>

        <div className="w-full mt-auto mb-4">
          {rendersVisualizer()}
        </div>

        <div className="w-full flex items-center justify-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`w-11 h-11 rounded-full border border-white/40 flex items-center justify-center shadow-md ac-btn-push text-white cursor-pointer ${
              playing ? 'bg-ac-orange' : 'bg-ac-mint'
            }`}
            title={playing ? '일시 정지' : '소리 재생하기'}
          >
            {playing ? (
              <Pause className="w-5 h-5 text-white fill-white" />
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-[11px] font-bold text-ac-brown/65 flex items-center gap-1 mb-1 select-none">
          <Volume2 className="w-3.5 h-3.5" /> 사운드 리스트 (Vercel Blob 음원)
        </span>

        {BG_TRACKS.map(t => {
          const isSelected = track === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTrack(t.id)}
              className={`w-full text-left p-3 rounded-2xl border ac-shadow-sm ac-btn-push flex items-center justify-between transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-transparent font-black scale-[1.01]' 
                  : 'bg-white/45 border-transparent hover:bg-white/70 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl select-none">{t.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-xs text-ac-brown">{t.name}</span>
                  <span className="text-[9px] text-ac-brown/50 line-clamp-1 font-semibold leading-none mt-0.5">
                    {t.description}
                  </span>
                </div>
              </div>
              
              {isSelected && playing && (
                <span className="text-xs text-ac-orange animate-pulse">PLAYING</span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => {
            setPlaying(false);
            setUserMuted(true);
            setTrack('none');
          }}
          className={`w-full p-2.5 rounded-2xl border border-dashed border-ac-brown/15 hover:border-ac-brown/40 hover:bg-white/60 text-[11px] font-bold text-center transition-all ${
            track === 'none' ? 'bg-[#FFEBEE] border-transparent text-ac-pink font-extrabold' : 'text-ac-brown/55'
          }`}
        >
          {track === 'none' ? '소리 정지됨 📴' : '플레이어 소리 일시 정지하기 🔇'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-white/20 border border-white/5 rounded-2xl text-[10px] text-ac-brown/60 leading-relaxed font-semibold flex gap-1.5 select-none font-sans">
        <HelpCircle className="w-4 h-4 text-ac-mint shrink-0 mt-0.5" />
        <p>
          집중 타이머가 끝나 휴식에 들어가면 소리가 멈추고, 
          휴식이 끝나고 집중 모드로 복귀 시 자동으로 연동 재생됩니다!
        </p>
      </div>
    </section>
  );
}
