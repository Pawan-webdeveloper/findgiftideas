import React from 'react';

interface CollectionsFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CollectionsFilter({
  selectedCategory,
  onSelectCategory,
}: CollectionsFilterProps) {
  const options = [
    { value: 'all', label: 'All Collections' },
    { value: 'recent', label: 'Recent' },
    { value: 'occasions', label: 'Occasions' },
    { value: 'recipients', label: 'Recipients' },
    { value: 'sustainability', label: 'Sustainability' },
  ];

  return (
    <div className="mb-12 flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="text-[10px] font-bold text-[#1A1A1A]/40 tracking-[0.3em] uppercase">
        Collections /
      </span>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isActive = selectedCategory === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectCategory(opt.value)}
              className={`px-5 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-sm font-black'
                  : 'bg-white border border-black/5 text-[#1A1A1A] hover:border-black/25 hover:bg-black/5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
