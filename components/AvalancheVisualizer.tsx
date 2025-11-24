import React, { useState, useEffect } from 'react';
import { CryptoAlgorithm, CipherMode } from '../types';
import { 
    encryptBuffer, 
    stringToBuffer, 
    flipBit, 
    calculateBitDiff, 
    hexToBuffer 
} from '../utils/cryptoUtils';
import { Zap, ArrowDown, Activity, RefreshCw } from 'lucide-react';

interface AvalancheVisualizerProps {
  algorithm: CryptoAlgorithm;
  mode: CipherMode;
  keyObj: CryptoKey | Uint8Array | null;
  ivHex: string;
  plaintext: string;
}

const AvalancheVisualizer: React.FC<AvalancheVisualizerProps> = ({
  algorithm,
  mode,
  keyObj,
  ivHex,
  plaintext
}) => {
  const [cipher1, setCipher1] = useState<ArrayBuffer | null>(null);
  const [cipher2, setCipher2] = useState<ArrayBuffer | null>(null);
  const [bitToFlip, setBitToFlip] = useState<number>(0); 
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const run = async () => {
        if (!keyObj || !plaintext) return;
        setIsProcessing(true);
        
        try {
            const iv = ivHex ? new Uint8Array(hexToBuffer(ivHex) || []) : new Uint8Array(algorithm === CryptoAlgorithm.AES ? 16 : 8);
            const inputBuf = stringToBuffer(plaintext);
            
            const c1 = await encryptBuffer(algorithm, mode, keyObj, iv, inputBuf);
            setCipher1(c1);

            const modifiedInput = flipBit(inputBuf, 0, bitToFlip);
            
            const c2 = await encryptBuffer(algorithm, mode, keyObj, iv, modifiedInput);
            setCipher2(c2);

        } catch (e) {
            console.error("Avalanche Error", e);
        }
        setIsProcessing(false);
    };
    run();
  }, [algorithm, mode, keyObj, ivHex, plaintext, bitToFlip]);

  if (!cipher1 || !cipher2) return <div className="text-cipher-400 animate-pulse font-mono text-center p-12">INITIALIZING_AVALANCHE_PROTOCOL...</div>;

  const diff = calculateBitDiff(cipher1, cipher2);
  const percent = Math.round((diff.diffBits / diff.totalBits) * 100);
  
  // Render Helper
  const renderHexRow = (buf: ArrayBuffer, diffIndices: number[] = [], isInput = false) => {
      const arr = new Uint8Array(buf);
      return (
        <div className="flex flex-wrap gap-1.5 font-mono text-sm">
            {Array.from(arr).map((byte, i) => {
                const isDiff = diffIndices.includes(i);
                const isFlippedByte = isInput && i === 0;
                
                let bgClass = "bg-slate-900 border-slate-700 text-slate-500 opacity-60";
                
                if (isInput && isFlippedByte) {
                    bgClass = "bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.4)] scale-110 z-10 font-bold opacity-100";
                } else if (!isInput && isDiff) {
                    bgClass = "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_5px_rgba(239,68,68,0.3)] opacity-100";
                } else if (!isInput && !isDiff) {
                    bgClass = "bg-green-500/5 border-green-900/30 text-green-700/50"; // Unchanged
                } else if (isInput) {
                    bgClass = "bg-slate-800 border-slate-700 text-slate-400";
                }

                return (
                    <div key={i} className={`w-9 h-9 flex items-center justify-center rounded-lg border ${bgClass} transition-all duration-500 text-xs`}>
                        {byte.toString(16).padStart(2,'0').toUpperCase()}
                    </div>
                );
            })}
        </div>
      );
  };

  return (
    <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="bg-black/20 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="text-cipher-400" size={20} /> Avalanche Effect Visualizer
            </h3>
            <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Modify Bit Index (Byte 0):</span>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                    {[0, 1, 2, 3].map(b => (
                        <button 
                            key={b}
                            onClick={() => setBitToFlip(b)}
                            className={`w-6 h-6 flex items-center justify-center text-xs rounded font-bold transition-all ${bitToFlip === b ? 'bg-cipher-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 relative bg-slate-900/30">
            
            {/* Column 1: Original */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Control Group</h4>
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">Original Input</span>
                </div>
                {renderHexRow(stringToBuffer(plaintext), [], true)}
                
                <div className="flex justify-center py-2 opacity-50">
                    <ArrowDown size={24} className="text-slate-600" />
                </div>

                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Result A</h4>
                {renderHexRow(cipher1)}
            </div>

            {/* Column 2: Modified */}
            <div className="space-y-6 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Experimental</h4>
                    <span className="text-[10px] bg-yellow-950/40 border border-yellow-500/30 px-2 py-1 rounded text-yellow-500 flex gap-1 items-center font-mono">
                        <Zap size={10} /> 1 Bit Flipped
                    </span>
                </div>
                {/* Visualizing Input B with flipped byte highlighted */}
                {renderHexRow(flipBit(stringToBuffer(plaintext), 0, bitToFlip), [0], true)}

                <div className="flex justify-center py-2 opacity-50">
                     <ArrowDown size={24} className="text-yellow-500/50" />
                </div>

                <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Result B (Diff)</h4>
                {renderHexRow(cipher2, diff.diffIndices)}
            </div>
        </div>

        {/* Stats Footer */}
        <div className="bg-black/40 p-6 border-t border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-8">
                <div className={`text-5xl font-black tracking-tighter drop-shadow-lg ${percent > 40 ? 'text-cipher-400' : 'text-red-500'}`}>
                    {percent}%
                </div>
                <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Diffusion Score</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Total Bits Changed: <span className="text-white font-mono">{diff.diffBits}</span> / {diff.totalBits}
                    </p>
                </div>
                <div className="h-10 w-[1px] bg-slate-800"></div>
                <div className="flex-1">
                    <p className={`text-sm italic ${percent > 40 ? 'text-cipher-200' : 'text-red-200'}`}>
                        {percent > 40 
                            ? "Excellent! The 'Avalanche Effect' is observed. Changing 1 bit scrambled half the output."
                            : "Poor Diffusion. Strong correlations detected. This cipher mode or key may be weak."}
                    </p>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-3 mt-5 rounded-full overflow-hidden shadow-inner border border-slate-700">
                <div 
                    className={`h-full transition-all duration-1000 relative overflow-hidden ${percent > 40 ? 'bg-gradient-to-r from-cipher-600 to-cipher-400' : 'bg-red-600'}`}
                    style={{ width: `${percent}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse-slow"></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AvalancheVisualizer;