/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Pencil, Star, RotateCcw } from 'lucide-react';

export function Memo() {
  const [text, setText] = useState('');

  const handleClear = () => {
    setText('');
  };

  return (
    <section className="bg-ac-yellow-light rounded-[2.5rem] border border-white/50 shadow-sm p-6 flex flex-col h-full min-h-[280px] relative overflow-hidden group">
      {/* Dynamic Star decoration, spinning gently on memo input */}
      <div className="absolute top-4 right-4 text-2xl select-none opacity-30 group-hover:opacity-100 transition-opacity">
        ✏️
      </div>

      <div className="flex items-center justify-between mb-4 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-ac-mint/20">
            <Pencil className="w-4 h-4 text-ac-orange" />
          </div>
          <h2 className="text-lg font-bold text-ac-brown flex items-center gap-1">
            반짝 메모 <span className="text-sm font-normal text-ac-brown/60">Notepad</span>
          </h2>
        </div>

        {/* Clear Button */}
        {text && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-bold text-ac-brown bg-white px-2.5 py-1 rounded-full border border-ac-brown/15 ac-shadow-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-transform cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> 지우기
          </button>
        )}
      </div>

      {/* Cozy Letter/Notepad Paper area */}
      <div className="flex-1 relative rounded-2xl border border-ac-brown/10 bg-white p-4 flex flex-col ac-shadow-sm overflow-hidden">
        {/* Beautiful stationary grid background lines using CSS linear gradients */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#5d574e 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            marginTop: '26px'
          }}
        ></div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="떠오른 영감이나 생각을 살짝 적어두기... (새로고침하면 날아가는 임시 메모장이에요 ⭐️)"
          className="w-full flex-1 bg-transparent border-none outline-none resize-none text-sm font-semibold text-ac-brown placeholder-ac-brown/35 leading-[28px] z-10 select-text"
          style={{
            lineHeight: '28px',
            paddingTop: '2px'
          }}
        />

        {/* Floating decor */}
        <div className="absolute bottom-2 right-3 flex items-center gap-0.5 text-xs text-ac-brown/40 font-bold select-none z-10 pointer-events-none">
          <Star className={`w-3 h-3 text-ac-yellow fill-ac-yellow ${text ? 'animate-spin' : ''}`} />
          <span>letter</span>
        </div>
      </div>
    </section>
  );
}
