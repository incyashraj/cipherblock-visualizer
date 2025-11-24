import React, { useState } from 'react';
import { Grid, ArrowRight, Calculator, Search } from 'lucide-react';

// Standard AES S-Box Table (16x16 flattened)
const AES_SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const SBoxVisualizer: React.FC = () => {
  const [hoveredByte, setHoveredByte] = useState<number | null>(null);
  const [selectedByte, setSelectedByte] = useState<number>(0);

  const activeByte = hoveredByte !== null ? hoveredByte : selectedByte;
  
  // Calculate row/col from the flat index (0-255)
  // Actually, the input byte IS the index into the S-Box.
  // Example: Input 0x53 -> Row 5, Col 3.
  
  const row = (activeByte >> 4) & 0xF;
  const col = activeByte & 0xF;
  const outputValue = AES_SBOX[activeByte];

  const toHex = (n: number) => n.toString(16).toUpperCase();

  return (
    <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col h-[600px]">
      <div className="bg-black/20 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
        <h3 className="font-bold text-white flex items-center gap-2">
            <Grid className="text-cipher-400" size={20} /> AES S-Box Lookup Table
        </h3>
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Search size={14} className="text-slate-500" />
            <span className="text-xs text-slate-400 mr-2">Input Byte:</span>
            <input 
                type="text" 
                maxLength={2}
                value={toHex(selectedByte).padStart(2, '0')}
                onChange={(e) => {
                    const val = parseInt(e.target.value, 16);
                    if (!isNaN(val) && val >= 0 && val <= 255) setSelectedByte(val);
                }}
                className="w-10 bg-transparent text-white font-mono font-bold outline-none border-b border-slate-600 focus:border-cipher-500 text-center uppercase"
            />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Table */}
        <div className="flex-1 p-6 overflow-auto custom-scrollbar flex items-center justify-center bg-slate-900/30">
            <div className="relative">
                {/* Column Headers */}
                <div className="flex ml-8 mb-2">
                    {Array.from({length: 16}).map((_, i) => (
                        <div key={i} className={`w-8 text-center text-[10px] font-bold font-mono transition-colors ${i === col ? 'text-cipher-400' : 'text-slate-600'}`}>
                            {toHex(i)}
                        </div>
                    ))}
                </div>
                
                <div className="flex">
                    {/* Row Headers */}
                    <div className="flex flex-col mr-2">
                        {Array.from({length: 16}).map((_, i) => (
                            <div key={i} className={`h-8 flex items-center justify-center text-[10px] font-bold font-mono transition-colors ${i === row ? 'text-cipher-400' : 'text-slate-600'}`}>
                                {toHex(i)}
                            </div>
                        ))}
                    </div>

                    {/* The Grid */}
                    <div className="grid grid-cols-16 gap-px bg-slate-800/50 border border-slate-800">
                        {AES_SBOX.map((val, idx) => {
                            const r = (idx >> 4) & 0xF;
                            const c = idx & 0xF;
                            const isActive = idx === activeByte;
                            const isRowHighlight = r === row;
                            const isColHighlight = c === col;
                            
                            return (
                                <div 
                                    key={idx}
                                    onMouseEnter={() => setHoveredByte(idx)}
                                    onMouseLeave={() => setHoveredByte(null)}
                                    onClick={() => setSelectedByte(idx)}
                                    className={`
                                        w-8 h-8 flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all duration-150
                                        ${isActive 
                                            ? 'bg-cipher-500 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10 scale-110 rounded' 
                                            : (isRowHighlight || isColHighlight) 
                                                ? 'bg-cipher-900/40 text-cipher-200' 
                                                : 'text-slate-500 hover:bg-slate-700 hover:text-white'}
                                    `}
                                >
                                    {toHex(val).padStart(2,'0')}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* Side Info Panel */}
        <div className="w-80 border-l border-slate-700/50 bg-black/20 p-6 backdrop-blur-md flex flex-col gap-6">
            
            <div className="space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2 uppercase tracking-wider">
                    <Calculator size={16} /> Operation Trace
                </h4>
                
                <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1 uppercase">Input</div>
                        <div className="text-2xl font-mono font-bold text-white">{toHex(activeByte).padStart(2,'0')}</div>
                    </div>
                    <ArrowRight size={20} className="text-slate-600" />
                    <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1 uppercase">Output</div>
                        <div className="text-2xl font-mono font-bold text-cipher-400">{toHex(outputValue).padStart(2,'0')}</div>
                    </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-400 bg-black/40 p-4 rounded-lg border border-slate-800/50">
                    <div className="flex justify-between">
                        <span>Row (High Nibble):</span>
                        <span className="text-cipher-300">{toHex(row)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Col (Low Nibble):</span>
                        <span className="text-cipher-300">{toHex(col)}</span>
                    </div>
                    <div className="border-t border-slate-800 my-2"></div>
                    <div className="flex justify-between text-slate-300">
                        <span>S-Box[{toHex(row)}, {toHex(col)}] = </span>
                        <span className="font-bold text-cipher-400">{toHex(outputValue).padStart(2,'0')}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-auto">
                <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider">Under the Hood</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    The value <strong>{toHex(outputValue).padStart(2,'0')}</strong> isn't random. It is calculated in the Galois Field <span className="font-mono text-white">GF(2⁸)</span> by:
                </p>
                <ol className="list-decimal pl-4 text-[11px] text-slate-400 space-y-1.5">
                    <li>Taking the <strong>Multiplicative Inverse</strong> of the input byte.</li>
                    <li>Applying an <strong>Affine Transformation</strong> (bit scrambling).</li>
                    <li>Adding the constant <strong>0x63</strong>.</li>
                </ol>
                <div className="mt-2 p-2 bg-purple-900/20 border border-purple-500/30 rounded text-[10px] text-purple-300 text-center italic">
                    This creates "Non-Linearity", essential for security.
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SBoxVisualizer;