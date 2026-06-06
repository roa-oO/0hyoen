/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChecklistItem } from '../types';
import { Check, Plus, Trash2, Leaf } from 'lucide-react';

export function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('checklist_items');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load checklist items:', e);
    }
  }, []);

  // Save to LocalStorage
  const saveItems = (updated: ChecklistItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('checklist_items', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save checklist items:', e);
    }
  };

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: trimmed,
      done: false
    };

    saveItems([...items, newItem]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const toggleItem = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  return (
    <section className="bg-white rounded-[2.5rem] border border-white shadow-sm p-6 flex flex-col h-full min-h-[400px] relative overflow-hidden group">
      {/* Visual leaf decoration as requested */}
      <div className="absolute top-4 right-4 text-2xl select-none opacity-30 group-hover:opacity-100 transition-opacity">
        🍃
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-ac-mint-light flex items-center justify-center border border-ac-mint/20">
          <Leaf className="w-4 h-4 text-ac-mint" />
        </div>
        <h2 className="text-lg font-bold text-ac-brown select-none flex items-center gap-1">
          오늘의 작은 약속 <span className="text-sm font-normal text-ac-brown/60">Checklist</span>
        </h2>
      </div>

      {/* Checklist input field */}
      <div className="flex items-center gap-2 mb-4 bg-[#F8FDF9] p-1.5 rounded-full border border-ac-mint/20">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 약속을 여기에 입력해요..."
          className="flex-1 bg-transparent px-4 py-1.5 text-sm font-semibold border-none outline-none text-ac-brown placeholder-ac-brown/45 select-text"
        />
        <button
          onClick={handleAddItem}
          aria-label="약속 추가하기"
          className="w-9 h-9 bg-ac-mint rounded-full border border-transparent flex items-center justify-center ac-shadow-sm ac-btn-push group"
        >
          <Plus className="w-5 h-5 text-white group-hover:scale-110" />
        </button>
      </div>

      {/* Items scroll zone */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[290px]">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#FDFBF7] rounded-2xl border border-dashed border-ac-brown/15 select-none my-2">
            <span className="text-4xl mb-2 animate-cute-float">🌱</span>
            <p className="text-xs font-semibold text-ac-brown/60 leading-relaxed max-w-[200px]">
              아직 할 일이 없어요.<br />작은 목표를 하나 심어볼까요?
            </p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-2xl border ac-shadow-sm transition-all ${
                item.done 
                  ? 'bg-ac-mint-light/40 border-ac-mint/20 opacity-70' 
                  : 'bg-[#FDFBF7] border-[#F0E6D2] hover:border-ac-brown/30'
              }`}
            >
              <div 
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer select-none group"
              >
                {/* Cute Flower-shaped checkbox */}
                <div className={`w-6 h-6 rounded-full border border-ac-brown/25 flex items-center justify-center ac-shadow-sm transition-all ${
                  item.done 
                    ? 'bg-ac-yellow' 
                    : 'bg-white group-hover:bg-ac-yellow-light'
                }`}>
                  {item.done ? (
                    <Check className="w-3.5 h-3.5 text-ac-brown stroke-[3.5]" />
                  ) : (
                    <span className="text-[10px] text-ac-brown/40 group-hover:block hidden">🌼</span>
                  )}
                </div>
                
                <span className={`text-sm font-semibold truncate max-w-[230px] transition-all ${
                  item.done ? 'line-through text-ac-brown/40 decoration-ac-brown/30' : 'text-ac-brown'
                }`}>
                  {item.text}
                </span>
              </div>

              {/* Trash/remove button */}
              <button
                onClick={() => removeItem(item.id)}
                aria-label="약속 지우기"
                className="p-1.5 text-ac-brown/50 hover:text-ac-pink hover:bg-ac-pink-light rounded-full border border-transparent hover:border-ac-pink/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
