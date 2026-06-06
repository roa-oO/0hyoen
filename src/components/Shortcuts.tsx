/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Star, Plus, Link, Trash2, Globe } from 'lucide-react';

interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon: string; // emoji representation
}

const PRESET_SHORTCUTS: Shortcut[] = [
  { id: 'p1', name: '네이버', url: 'https://www.naver.com', icon: '🏡' },
  { id: 'p2', name: '구글', url: 'https://www.google.com', icon: '⭐' },
  { id: 'p3', name: '노션', url: 'https://www.notion.so', icon: '📝' },
  { id: 'p4', name: '깃허브', url: 'https://github.com', icon: '🐙' }
];

export function Shortcuts() {
  const [customList, setCustomList] = useState<Shortcut[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🏡');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('my_shortcuts');
      if (stored) {
        setCustomList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse shortcuts list:', e);
    }
  }, []);

  const saveList = (updated: Shortcut[]) => {
    setCustomList(updated);
    try {
      localStorage.setItem('my_shortcuts', JSON.stringify(updated));
    } catch (e) {
      console.error('Shortcut save failed:', e);
    }
  };

  const handleAdd = () => {
    const trimmedName = name.trim();
    let trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    const newItem: Shortcut = {
      id: `shortcut-${Date.now()}`,
      name: trimmedName,
      url: trimmedUrl,
      icon: icon
    };

    saveList([...customList, newItem]);
    setName('');
    setUrl('');
    setIcon('🏡');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = customList.filter(item => item.id !== id);
    saveList(updated);
  };

  const allShortcuts = [...PRESET_SHORTCUTS, ...customList];
  const emojis = ['🏡', '⭐', '🍃', '🌸', '🎁', '🍅', '🐾', '🍯', '🌳', '🥥', '🍊', '🔔'];

  return (
    <section className="bg-white rounded-[2rem] border border-white shadow-sm p-6 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <span className="absolute bottom-2 right-4 text-3xl opacity-10 select-none">🏡</span>

      <div className="flex items-center justify-between mb-4 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ac-mint-light flex items-center justify-center border border-ac-mint/10">
            <Home className="w-4 h-4 text-ac-mint" />
          </div>
          <h2 className="text-lg font-bold text-ac-brown flex items-center gap-1">
            바람 부는 길목 <span className="text-sm font-normal text-ac-brown/60">Shortcuts</span>
          </h2>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs font-bold text-ac-brown bg-ac-yellow px-3 py-1 rounded-full border border-[#FFDF65] ac-shadow-sm ac-btn-push cursor-pointer"
        >
          <Plus className="w-3 h-3" /> 추가하기
        </button>
      </div>

      {/* Add Shortcut Form Modal overlay inside card */}
      {showAddForm && (
        <div className="bg-[#FDFBF7] border border-[#F0E6D2] p-4 rounded-2xl mb-4 text-xs font-semibold relative animate-cute-float text-ac-brown select-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ac-brown/70">이름</label>
              <input
                type="text"
                placeholder="예: 내 레포지토리"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-ac-brown/15 px-3 py-2 rounded-xl text-xs font-bold outline-none text-ac-brown placeholder-ac-brown/30 focus:border-ac-mint"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ac-brown/70">웹주소 (URL)</label>
              <input
                type="text"
                placeholder="예: github.com/my"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-white border border-ac-brown/15 px-3 py-2 rounded-xl text-xs font-bold outline-none text-ac-brown placeholder-ac-brown/30 focus:border-ac-mint"
              />
            </div>
          </div>

          {/* Emoji Badge selector */}
          <div className="flex flex-col gap-1.5 mb-4">
            <span className="text-[11px] font-bold text-ac-brown/70">이정표 아이콘</span>
            <div className="flex flex-wrap gap-1.5">
              {emojis.map(emo => (
                <button
                  key={emo}
                  onClick={() => setIcon(emo)}
                  className={`text-lg p-1.5 rounded-lg border transition-all cursor-pointer ${
                    icon === emo ? 'bg-[#FFDF65] border-[#FFD54F]' : 'bg-white border-ac-brown/10 hover:border-ac-brown/25'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border border-ac-brown/10 hover:bg-white text-ac-brown/70 rounded-full cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 bg-ac-mint border border-transparent ac-shadow-sm text-white rounded-full font-black hover:bg-ac-mint/90 cursor-pointer"
            >
              등록할래!
            </button>
          </div>
        </div>
      )}

      {/* Grid of Leaf-styled bookmarked house-gates */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allShortcuts.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer referrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-[22px] border border-[#F0E6D2] bg-[#FDFBF7] ac-shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all relative group text-center"
          >
            {/* Dynamic visual bubble for shortcut icons */}
            <div className="w-11 h-11 bg-white rounded-full border border-ac-brown/10 flex items-center justify-center text-2xl ac-shadow-sm mb-2 group-hover:scale-115 transition-transform">
              {item.icon}
            </div>

            <span className="text-xs font-bold text-ac-brown">
              {item.name}
            </span>

            {/* Custom delete option for user bookmarks */}
            {customList.some(c => c.id === item.id) && (
              <button
                onClick={(e) => handleDelete(item.id, e)}
                title="삭제하기"
                className="absolute top-1 right-1 p-1 bg-white hover:bg-ac-pink-light border border-ac-brown/15 hover:border-ac-pink/45 text-ac-brown/40 hover:text-ac-pink rounded-full transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            {/* Micro link badge */}
            <span className="text-[9px] text-ac-brown/45 font-mono truncate max-w-full opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 pointer-events-none">
              {item.url.replace(/^https?:\/\/(www\.)?/i, '')}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
