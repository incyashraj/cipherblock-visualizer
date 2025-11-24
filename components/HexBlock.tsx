import React from 'react';

interface HexBlockProps {
  data: number[];
  label: string;
  index: number;
  variant?: 'neutral' | 'encrypt' | 'decrypt'; // Changed from highlight boolean to variant
  paddingCount?: number;
}

const HexBlock: React.FC<HexBlockProps> = ({ data, label, index, variant = 'neutral', paddingCount = 0 }) => {
  const blockSize = data.length > 0 ? data.length : 16;
  const isSmallBlock = blockSize <= 8;

  // Theme configuration based on variant
  const theme = {
    neutral: {
        bg: 'bg-slate-900/60',
        border: 'border-slate-700/50',
        hover: 'hover:border-slate-600 hover:bg-slate-800/80',
        indicator: 'bg-slate-600',
        text: 'text-slate-500',
        cell: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500',
        glow: ''
    },
    encrypt: {
        bg: 'bg-cipher-950/40',
        border: 'border-cipher-500/50',
        hover: 'hover:scale-[1.02]',
        indicator: 'bg-cipher-400 animate-pulse',
        text: 'text-cipher-400',
        cell: 'bg-cipher-900/50 border-cipher-500/30 text-cipher-200 hover:bg-cipher-500 hover:text-white hover:border-cipher-400',
        glow: 'shadow-[0_0_25px_rgba(34,197,94,0.15)]'
    },
    decrypt: {
        bg: 'bg-blue-950/40',
        border: 'border-blue-500/50',
        hover: 'hover:scale-[1.02]',
        indicator: 'bg-blue-400',
        text: 'text-blue-400',
        cell: 'bg-blue-900/50 border-blue-500/30 text-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-400',
        glow: 'shadow-[0_0_25px_rgba(59,130,246,0.15)]'
    }
  };

  const t = theme[variant];

  return (
    <div 
      className={`
        relative flex flex-col gap-2 p-3 rounded-xl border transition-all duration-500 group
        ${t.bg} ${t.border} ${t.hover} ${t.glow} backdrop-blur-md
      `}
    >
      {variant === 'encrypt' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cipher-500/5 to-transparent pointer-events-none"></div>
      )}
      
      <div className="flex justify-between items-center mb-1 cursor-help z-10">
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${t.indicator}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${t.text}`}>
                {label} {index !== -1 ? String(index).padStart(2, '0') : ''}
            </span>
        </div>
        <span className="text-[9px] text-slate-600 font-mono border border-slate-800 px-1 rounded bg-black/30">{data.length}B</span>
        
        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 text-slate-300 text-[10px] p-2 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-48 text-center backdrop-blur-sm z-50">
             Memory Block (Hexadecimal Representation)
        </div>
      </div>
      
      <div className={`grid grid-cols-4 gap-1.5 font-mono text-sm relative z-10`}>
        {Array.from({ length: isSmallBlock ? 8 : 16 }).map((_, i) => {
          const byte = data[i];
          const hasByte = byte !== undefined;
          const hex = hasByte ? byte.toString(16).padStart(2, '0').toUpperCase() : '--';
          const char = hasByte && byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
          
          // Check if this byte index is part of padding
          // paddingCount is passed for the *last* block.
          const isPadding = hasByte && paddingCount > 0 && i >= (data.length - paddingCount);

          let cellClass = 'bg-transparent border-slate-800/50 text-slate-700';
          
          if (hasByte) {
              if (isPadding) {
                  cellClass = 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900';
              } else {
                  cellClass = t.cell;
              }
          }
          
          return (
            <div 
                key={i} 
                className={`
                    group/byte relative flex items-center justify-center h-7 w-7 rounded-md border text-[11px] cursor-default transition-all duration-300
                    ${cellClass}
                `}
            >
               <span>{hex}</span>
               
               {/* Tiny Byte Tooltip */}
               {hasByte && (
                 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/byte:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-lg font-sans">
                   {isPadding ? <span className="text-yellow-400 font-bold">PADDING</span> : <span>ASCII: <span className={`${t.text} font-mono`}>'{char}'</span></span>}
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HexBlock;