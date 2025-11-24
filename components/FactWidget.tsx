
import React, { useState, useEffect } from 'react';
import { Lightbulb, X, RefreshCw } from 'lucide-react';
import { getRandomFact } from '../data/facts';

const FactWidget: React.FC = () => {
  const [fact, setFact] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setFact(getRandomFact());
  }, []);

  const nextFact = () => {
    setFact(getRandomFact());
  };

  if (!isVisible) return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-cipher-600 hover:bg-cipher-500 text-white p-3 rounded-full shadow-lg z-50 transition-all hover:scale-110"
        title="Show Crypto Fact"
      >
          <Lightbulb size={20} />
      </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-in slide-in-from-right-10 duration-500">
      <div className="bg-slate-900/90 backdrop-blur-md border border-cipher-500/30 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="bg-cipher-900/50 px-4 py-2 border-b border-cipher-500/20 flex justify-between items-center">
            <h4 className="text-xs font-bold text-cipher-400 flex items-center gap-1.5">
                <Lightbulb size={12} /> DID YOU KNOW?
            </h4>
            <div className="flex gap-1">
                 <button onClick={nextFact} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700/50 rounded">
                    <RefreshCw size={12} />
                </button>
                <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700/50 rounded">
                    <X size={12} />
                </button>
            </div>
        </div>
        <div className="p-4">
            <p className="text-sm text-slate-200 leading-relaxed italic">
                "{fact}"
            </p>
        </div>
        <div className="h-1 w-full bg-slate-800">
             <div className="h-full bg-cipher-500/50 w-1/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FactWidget;
