import React, { useState, useEffect } from 'react';
import { runFeistelDemo, FeistelStep } from '../utils/des';
import { Play, SkipForward, RotateCcw, ArrowDown, Info } from 'lucide-react';

interface RoundVisualizerProps {
  input: string; // 8 chars
  inputKey: string;
}

const RoundVisualizer: React.FC<RoundVisualizerProps> = ({ input, inputKey }) => {
  const [steps, setSteps] = useState<FeistelStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Prepare input (pad to 8 bytes if needed)
    const encoder = new TextEncoder();
    let bytes = Array.from(encoder.encode(input));
    if (bytes.length < 8) {
       bytes = [...bytes, ...new Array(8 - bytes.length).fill(0)];
    }
    bytes = bytes.slice(0, 8);
    
    // Simple key bytes
    const keyBytes = Array.from(encoder.encode(inputKey || 'Key'));
    
    const results = runFeistelDemo(bytes, keyBytes);
    setSteps(results);
    setCurrentStep(0);
  }, [input, inputKey]);

  const step = steps[currentStep];

  if (!step) return <div className="text-slate-500">Processing...</div>;

  // Helper for narrative text
  const getStepDescription = (s: FeistelStep, idx: number) => {
     if (idx === 0) return `Initial State: We've taken your text "${input}" and converted it to numbers. We split it into a Left half (Blue) and a Right half (Purple).`;
     return `Round ${s.round}: The Right half goes through the "F-Function" mixer using part of the Key. The result is XORed (combined) with the Left half to create a new block.`;
  };

  return (
    <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="bg-black/20 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
        <h3 className="font-bold text-white flex items-center gap-2">
            <RotateCcw className="text-cipher-400" size={20} /> Feistel Network Internal View
        </h3>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold transition-colors border border-transparent hover:border-slate-600"
            >Back</button>
            <span className="font-mono text-sm text-cipher-400 font-bold px-3 bg-cipher-950/50 py-1 rounded border border-cipher-500/20">Round {step.round} / 4</span>
            <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="px-3 py-1.5 rounded-lg bg-cipher-600 hover:bg-cipher-500 text-white disabled:opacity-50 disabled:bg-slate-700 text-xs font-bold transition-colors shadow-lg shadow-cipher-500/20"
            >Next Step</button>
        </div>
      </div>

      <div className="p-8 relative min-h-[450px] flex justify-center bg-slate-900/30">
         
         <div className="flex gap-24 relative z-10">
            {/* Left Branch */}
            <div className="flex flex-col items-center gap-6 w-32">
                <div className="font-bold text-blue-400 text-sm uppercase tracking-wider">LEFT Half</div>
                <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl text-center font-mono w-full text-blue-200 text-lg shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-sm">
                    {step.left.map(b => b.toString(16).padStart(2,'0')).join(' ')}
                </div>
                
                <div className="h-32 w-0.5 bg-gradient-to-b from-blue-500/50 to-slate-700 relative"></div>

                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-slate-600 text-white font-bold bg-slate-900 z-10 shadow-xl" title="XOR Operation">⊕</div>
                
                <div className="h-20 w-0.5 bg-slate-700"></div>
                
                <div className="font-bold text-slate-300 text-sm">New Result</div>
                <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl text-center font-mono w-full text-purple-200 text-lg shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-sm">
                    {step.newRight.map(b => b.toString(16).padStart(2,'0')).join(' ')}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">(Becomes Right)</div>
            </div>

            {/* Right Branch */}
            <div className="flex flex-col items-center gap-6 w-32">
                 <div className="font-bold text-purple-400 text-sm uppercase tracking-wider">RIGHT Half</div>
                 <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl text-center font-mono w-full text-purple-200 text-lg shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-sm">
                    {step.right.map(b => b.toString(16).padStart(2,'0')).join(' ')}
                </div>

                <div className="h-8 w-0.5 bg-purple-500/50"></div>

                {/* Function F Box */}
                <div className="bg-slate-900/80 border border-cipher-500 p-5 rounded-xl w-56 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative transition-transform hover:scale-105 backdrop-blur-md">
                    <div className="text-center font-bold text-cipher-400 mb-1">Function F</div>
                    <div className="text-[10px] text-slate-400 text-center mb-3 uppercase tracking-wider">Mixing Function</div>
                    <div className="bg-black/50 p-2 rounded text-center font-mono text-xs text-yellow-500 border border-yellow-500/20">
                        Key Fragment: {step.subkey.toString(16).padStart(2,'0')}
                    </div>
                    {/* Connection to XOR */}
                    <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-gradient-to-r from-cipher-500 to-transparent"></div>
                    <div className="absolute top-1/2 -left-2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-cipher-500"></div>
                </div>

                <div className="h-8 w-0.5 bg-slate-700 relative">
                     {/* Cross over line start */}
                     <div className="absolute bottom-0 left-1/2 w-[220px] h-0.5 bg-slate-700 -translate-x-[220px] rotate-45 origin-bottom-left opacity-20"></div>
                </div>

                <div className="font-bold text-slate-500 text-sm">Unchanged</div>
                <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl text-center font-mono w-full text-blue-200 text-lg shadow-lg opacity-60 grayscale">
                    {step.right.map(b => b.toString(16).padStart(2,'0')).join(' ')}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">(Becomes Left)</div>
            </div>
         </div>
         
         {/* Background connecting lines for swapping visual aid */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path d="M 62% 140 C 62% 340, 38% 340, 38% 520" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8,8" />
            <path d="M 38% 440 L 62% 520" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8,8" />
         </svg>

      </div>
      
      <div className="bg-black/30 p-6 border-t border-slate-700/50 flex gap-4 items-start backdrop-blur-sm">
        <div className="bg-cipher-500/10 p-2 rounded-lg text-cipher-500 shrink-0 mt-1 border border-cipher-500/20">
            <Info size={20} />
        </div>
        <div>
             <h4 className="font-bold text-white text-sm mb-1">Step Analysis</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
                {getStepDescription(step, currentStep)}
             </p>
        </div>
      </div>
    </div>
  );
};

export default RoundVisualizer;