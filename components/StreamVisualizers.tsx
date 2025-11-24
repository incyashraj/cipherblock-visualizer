
import React, { useState, useEffect, useRef } from 'react';
import { calculateBirthdayProbability, stepLFSR, initRC4, stepRC4KSA, stepRC4PRGA, LFSRState, RC4State } from '../utils/streamUtils';
import { Users, Play, SkipForward, RefreshCw, ArrowRight, ArrowDown } from 'lucide-react';

// --- BIRTHDAY PARADOX VISUALIZER ---
export const BirthdayVisualizer: React.FC<{ input: string }> = ({ input }) => {
  const n = parseInt(input) || 23;
  const prob = calculateBirthdayProbability(n);

  return (
    <div className="glass-panel border border-slate-700/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center h-full">
        <div className="bg-cipher-900/30 p-6 rounded-full mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] border border-cipher-500/30">
            <Users size={64} className="text-cipher-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">The Birthday Paradox</h3>
        <p className="text-slate-400 mb-8 max-w-md">
            In a room of <strong className="text-white">{n}</strong> people, what is the chance that two share a birthday?
        </p>

        <div className="w-full max-w-lg space-y-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                <span className="text-slate-500">Probability</span>
                <span className={prob > 50 ? "text-red-400" : "text-cipher-400"}>{prob.toFixed(2)}%</span>
            </div>
            <div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                    className={`h-full transition-all duration-1000 ${prob > 50 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-cipher-600 to-cipher-400'}`}
                    style={{ width: `${prob}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-600 font-mono">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>

        <div className="mt-8 p-4 bg-black/40 rounded-lg border border-slate-800 text-sm text-slate-300 max-w-md">
            {n === 23 && (
                <p><strong>Fun Fact:</strong> At just 23 people, the probability crosses 50%! This counter-intuitive fact is crucial in crypto to understand <strong>Hash Collisions</strong>.</p>
            )}
            {n > 50 && (
                <p>With {n} people, it's almost a mathematical certainty (97%+)!</p>
            )}
            {n < 23 && (
                <p>The probability is still relatively low, but it rises exponentially.</p>
            )}
        </div>
    </div>
  );
};

// --- LFSR VISUALIZER ---
export const LFSRVisualizer: React.FC = () => {
    // Default 4-bit LFSR from PDF
    const [state, setState] = useState<LFSRState>({
        bits: [1, 0, 0, 1],
        outputBit: -1,
        feedbackBit: -1,
        taps: [0, 1] // Rightmost 2 bits (indices 0 and 1 from right) -> x^4 + x^3 + 1? Let's match PDF visuals if possible, or just generic
    });
    const [history, setHistory] = useState<number[]>([]);

    const handleStep = () => {
        const next = stepLFSR(state.bits, state.taps);
        setState(next);
        setHistory(prev => [...prev, next.outputBit]);
    };

    const handleReset = () => {
        setState({ bits: [1, 0, 0, 1], outputBit: -1, feedbackBit: -1, taps: [0, 1] });
        setHistory([]);
    };

    return (
        <div className="glass-panel border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-8">
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <RefreshCw className="text-cipher-400" size={20} /> LFSR State Machine
                </h3>
                <div className="flex gap-2">
                    <button onClick={handleReset} className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded text-white transition">Reset</button>
                    <button onClick={handleStep} className="px-4 py-1 text-xs bg-cipher-600 hover:bg-cipher-500 rounded text-white font-bold transition flex items-center gap-1">
                        <Play size={12} /> Step
                    </button>
                </div>
             </div>

             <div className="flex flex-col items-center justify-center py-8 relative">
                 {/* Feedback Path Visualization lines would go here ideally, purely CSS for now */}
                 <div className="flex gap-4 relative">
                     {/* Feedback Calculation */}
                     <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in fade-in">
                         <div className="text-[10px] text-slate-500 uppercase mb-1">Feedback (XOR)</div>
                         <div className="w-10 h-10 rounded-full border-2 border-cipher-500 bg-slate-900 flex items-center justify-center text-cipher-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            {state.feedbackBit !== -1 ? state.feedbackBit : '?'}
                         </div>
                         <ArrowDown className="text-cipher-500 mt-1" size={16} />
                     </div>

                     {state.bits.map((bit, i) => {
                         const isTapped = state.taps.includes(state.bits.length - 1 - i);
                         return (
                             <div key={i} className="relative group">
                                 {isTapped && <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-600"></div>}
                                 <div className={`w-16 h-16 flex items-center justify-center text-2xl font-mono font-bold rounded-xl border-2 transition-all duration-300 ${isTapped ? 'border-cipher-500/50 bg-cipher-900/20 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
                                     {bit}
                                 </div>
                                 <div className="text-[10px] text-center mt-2 text-slate-600 font-mono">S{state.bits.length - 1 - i}</div>
                             </div>
                         );
                     })}
                     
                     {/* Output Arrow */}
                     <div className="flex items-center">
                        <ArrowRight className="text-slate-500 mx-2" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-500 mb-1">OUT</span>
                            <div className={`w-10 h-10 rounded border flex items-center justify-center font-mono font-bold ${state.outputBit !== -1 ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'border-slate-800 text-slate-700'}`}>
                                {state.outputBit !== -1 ? state.outputBit : '-'}
                            </div>
                        </div>
                     </div>
                 </div>
             </div>

             <div className="bg-black/40 p-4 rounded-xl border border-slate-800">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Keystream Output (History)</h4>
                 <div className="font-mono text-sm text-cipher-400 break-all tracking-widest">
                     {history.length > 0 ? history.join('') : <span className="text-slate-700 opacity-50">Click Step to generate stream...</span>}
                 </div>
             </div>
        </div>
    );
};

// --- RC4 VISUALIZER ---
export const RC4Visualizer: React.FC<{ inputKey: string }> = ({ inputKey }) => {
    // Simplified to 16 bytes for visualization instead of 256
    const [rc4State, setRc4State] = useState<RC4State | null>(null);
    const [history, setHistory] = useState<number[]>([]);
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        setRc4State(initRC4(inputKey || 'Key', 16)); // 16-byte S-box for demo
        setHistory([]);
    }, [inputKey]);

    // Auto-play effect
    useEffect(() => {
        let interval: any;
        if (autoPlay && rc4State) {
            interval = setInterval(() => {
                step();
            }, 200);
        }
        return () => clearInterval(interval);
    }, [autoPlay, rc4State]);

    const step = () => {
        if (!rc4State) return;
        let next: RC4State;
        if (rc4State.phase === 'KSA') {
            next = stepRC4KSA(rc4State);
        } else {
            next = stepRC4PRGA(rc4State);
            if (next.output !== undefined) {
                setHistory(prev => [...prev, next.output!]);
            }
        }
        setRc4State(next);
    };

    if (!rc4State) return <div>Loading...</div>;

    return (
        <div className="glass-panel border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
             <div className="flex justify-between items-center border-b border-slate-800/50 pb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white">RC4 State (S-Box)</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${rc4State.phase === 'KSA' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-cipher-500/20 text-cipher-400'}`}>
                        Phase: {rc4State.phase}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setAutoPlay(!autoPlay)} className={`px-3 py-1 text-xs rounded text-white transition ${autoPlay ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-500'}`}>
                        {autoPlay ? 'Stop' : 'Auto Play'}
                    </button>
                    <button onClick={() => step()} className="px-4 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-white font-bold transition flex items-center gap-1">
                        <Play size={12} /> Step
                    </button>
                </div>
             </div>

             <div className="grid grid-cols-8 gap-2">
                 {rc4State.S.map((val, idx) => {
                     const isI = idx === rc4State.i;
                     const isJ = idx === rc4State.j;
                     return (
                         <div key={idx} className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all duration-300 relative ${isI || isJ ? 'scale-105 z-10' : 'bg-slate-900/50 border-slate-800 text-slate-500' } ${isI ? 'border-cipher-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] bg-cipher-900/40' : ''} ${isJ ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] bg-yellow-900/40' : ''}`}>
                             <span className="text-sm font-mono font-bold text-white">{val.toString(16).toUpperCase().padStart(2,'0')}</span>
                             <div className="absolute bottom-1 flex gap-1">
                                {isI && <span className="text-[8px] bg-cipher-500 text-black px-1 rounded font-bold">i</span>}
                                {isJ && <span className="text-[8px] bg-yellow-500 text-black px-1 rounded font-bold">j</span>}
                             </div>
                         </div>
                     );
                 })}
             </div>

             {rc4State.phase === 'PRGA' && (
                 <div className="bg-black/40 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                     <div className="text-center">
                         <div className="text-[10px] text-slate-500 uppercase mb-1">Output Byte</div>
                         <div className="text-2xl font-mono font-bold text-cipher-400">
                             {rc4State.output !== undefined ? rc4State.output.toString(16).toUpperCase().padStart(2,'0') : '--'}
                         </div>
                     </div>
                     <div className="h-8 w-[1px] bg-slate-700"></div>
                     <div className="flex-1 overflow-hidden">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Stream History</div>
                        <div className="font-mono text-xs text-slate-300 break-all">
                            {history.map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ')}
                        </div>
                     </div>
                 </div>
             )}
        </div>
    );
};
