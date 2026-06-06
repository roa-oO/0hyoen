/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Gift, Award, Star } from 'lucide-react';

export interface SessionStatsRef {
  increment: () => void;
}

export const SessionStats = forwardRef<SessionStatsRef, {}>((_, ref) => {
  const [sessions, setSessions] = useState(0);
  const [todayDate, setTodayDate] = useState('');

  // Find today's date in 'YYYY-MM-DD' key
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const todayStr = getTodayString();
    setTodayDate(todayStr);

    try {
      const storedDate = localStorage.getItem('session_date');
      const storedCount = localStorage.getItem('session_count');

      if (storedDate === todayStr) {
        setSessions(storedCount ? parseInt(storedCount, 10) : 0);
      } else {
        // Different day! Reset daily focus count as per prompt but we can save old date if wanted.
        // Prompt says key: 'session_date' and 'session_count'.
        setSessions(0);
        localStorage.setItem('session_date', todayStr);
        localStorage.setItem('session_count', '0');
      }
    } catch (e) {
      console.error('Failed to parse focus stats:', e);
    }
  }, []);

  const handleIncrement = () => {
    const todayStr = getTodayString();
    const nextCount = sessions + 1;
    setSessions(nextCount);
    
    try {
      localStorage.setItem('session_date', todayStr);
      localStorage.setItem('session_count', String(nextCount));
    } catch (e) {
      console.error('Failed to save focus status:', e);
    }
  };

  useImperativeHandle(ref, () => ({
    increment: handleIncrement
  }));

  // Clear/Reset statistics manually
  const resetStats = () => {
    if (window.confirm('정말 세션 기록을 지우고 스탬프를 초기화할까요? 🐾')) {
      setSessions(0);
      try {
        localStorage.setItem('session_count', '0');
      } catch (e) {
        console.error('Stats reset error:', e);
      }
    }
  };

  // Stamp collection box max 8
  const renderedStamps = [];
  const maxStamps = 8;
  for (let i = 0; i < maxStamps; i++) {
    if (i < sessions) {
      renderedStamps.push(
        <div 
          key={i} 
          className="w-10 h-10 rounded-full bg-[#FFEBEE] border border-ac-pink/20 flex items-center justify-center shadow-sm text-lg animate-cute-bounce select-none relative group cursor-help"
          title="집중 완료 토마토 스탬프! 🍅"
        >
          🍅
          <span className="absolute -top-1 -right-1 text-[8px] bg-ac-yellow rounded-full px-1 border border-white font-black shadow-sm">OK</span>
        </div>
      );
    } else {
      renderedStamps.push(
        <div 
          key={i} 
          className="w-10 h-10 rounded-full bg-white border border-dashed border-ac-brown/15 flex items-center justify-center opacity-75 text-sm select-none"
        >
          🐾
        </div>
      );
    }
  }

  // Get nice title encouragement based on completed count
  const getSubTitleText = () => {
    if (sessions === 0) return '첫 번째 집중 토마토를 수확해 봐요! 🍅';
    if (sessions < 3) return '차근차근 아주 잘하고 있어요! 🌱';
    if (sessions < 5) return '대단해요! 가방이 토마토로 두둑해요 🎁';
    return '와! 오늘 우리 마을 최고의 일꾼이네요! 👑';
  };

  return (
    <section className="w-full bg-white rounded-[2rem] border border-white shadow-sm p-6 flex flex-col relative overflow-hidden">
      {/* Decorative acorn in background */}
      <span className="absolute top-2 right-4 text-2xl opacity-15 select-none pointer-events-none">🌰</span>

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 w-full select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ac-blue-light flex items-center justify-center border border-ac-blue/20">
            <Gift className="w-4 h-4 text-ac-blue" />
          </div>
          <h2 className="text-lg font-bold text-ac-brown">
            수확한 집중 토마토 <span className="text-sm font-normal text-ac-brown/60">Sessions</span>
          </h2>
        </div>

        <button 
          onClick={resetStats}
          className="text-[10px] font-bold text-ac-pink hover:text-ac-pink-light border border-ac-pink/30 hover:bg-ac-pink-light px-2.5 py-1 rounded-full transition-all cursor-pointer"
        >
          스탬프 리셋
        </button>
      </div>

      <div className="bg-[#FDFBF7] border border-[#F0E6D2] p-4 rounded-2xl flex flex-col items-center">
        {/* Helper Encouragement */}
        <p className="text-xs font-bold text-ac-brown/70 mb-3 flex items-center gap-1 select-none">
          <Star className="w-3 h-3 text-ac-yellow fill-ac-yellow" />
          <span>{getSubTitleText()}</span>
        </p>

        {/* Stamps grid */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center py-1">
          {renderedStamps}
        </div>

        {/* Cumulative count bubble */}
        <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-ac-brown/10 select-none text-xs text-ac-brown/70">
          <span>오늘 심어서 수확한 열매</span>
          <div className="flex items-center gap-1">
            <span className="font-bubbly text-base font-black text-ac-brown">{sessions}</span>
            <span className="font-semibold text-ac-brown/60">개</span>
          </div>
        </div>
      </div>
    </section>
  );
});

SessionStats.displayName = 'SessionStats';
