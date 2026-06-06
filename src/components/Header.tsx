/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock } from 'lucide-react';

const GREETINGS = [
  "영현, 넌 오늘도 역시 귀엽구나! 🐻",
  "영현, 오늘 바람이 상쾌해! 차근차근 즐겁게 가보자구 🍃",
  "영현, 너의 모든 걸음걸음이 반짝반짝 빛나길 바랄게 ⭐",
  "영현, 따스한 햇살 가득 받으며 평화로운 하루 시작해 볼까? 🏡",
  "영현, 무언가 이뤄내지 않아도 넌 그 자체로 소중한 친구야 🐰",
  "영현, 귀여운 나뭇잎 하나 들고, 오늘도 씩씩하게 걸어가 보자 🌿"
];

export function Header() {
  const [time, setTime] = useState<Date>(new Date());
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    // Generate static charm for the session but allow random rotation
    const randomIndex = Math.floor(Math.random() * GREETINGS.length);
    setGreeting(GREETINGS[randomIndex]);

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekDay})`;
  };

  const cycleGreeting = () => {
    const currentIndex = GREETINGS.indexOf(greeting);
    const nextIndex = (currentIndex + 1) % GREETINGS.length;
    setGreeting(GREETINGS[nextIndex]);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-white/50 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-ac-yellow-light opacity-50 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-ac-mint-light opacity-60 rounded-full blur-xl pointer-events-none"></div>

      {/* User Greeting Segment */}
      <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
        <div 
          onClick={cycleGreeting}
          title="말 주머니 톡 건드리기"
          className="w-16 h-16 bg-[#FFDF65] rounded-full border border-white/50 flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        >
          <span className="text-3xl filter drop-shadow">🍃</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-ac-mint px-2.5 py-0.5 bg-[#E7F3EC] rounded-full border border-[#D5E6DC]">
              우리 마을 주민
            </span>
            <span className="text-xs text-[#5D574E]/70 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-ac-yellow" /> 주민 대표
            </span>
          </div>
          <h1 
            onClick={cycleGreeting}
            className="text-xl md:text-2xl font-bold text-[#4A7C59] tracking-tight mt-1 cursor-pointer transition-all hover:opacity-80"
          >
            {greeting}
          </h1>
        </div>
      </div>

      {/* Time & Date Display Segment */}
      <div className="flex items-center gap-4 bg-[#F8FDF9] border border-ac-mint/20 border-dashed px-5 py-3 rounded-[20px] relative z-10 w-full md:w-auto ml-auto justify-center md:justify-start">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-ac-brown text-sm font-semibold select-none">
            <Calendar className="w-4 h-4 text-ac-mint" />
            <span className="font-bubbly">{formatDate(time)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-2xl md:text-3xl font-extrabold text-ac-brown font-bubbly select-none">
            <Clock className="w-5 h-5 text-ac-orange animate-pulse" />
            <span className="tracking-wide">{formatTime(time)}</span>
          </div>
        </div>
        
        {/* Cute Mascot inside Header */}
        <div className="hidden lg:flex w-12 h-12 bg-ac-blue-light border border-white/40 rounded-full items-center justify-center select-none shadow-sm">
          <span className="text-2xl animate-cute-bounce">🐱</span>
        </div>
      </div>
    </header>
  );
}
