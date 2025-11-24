
import React, { useEffect, useState } from 'react';
import { X, BarChart3, Globe, Zap, Clock } from 'lucide-react';
import { AppStats, getAnalyticsData } from '../utils/analytics';

interface StatsModalProps {
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    setStats(getAnalyticsData());
  }, []);

  if (!stats) return null;

  const sortedAlgos = Object.entries(stats.algoUsage).sort(([,a], [,b]) => (b as number) - (a as number));
  const mostPopular = sortedAlgos.length > 0 ? sortedAlgos[0][0] : 'None';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-950 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cipher-500 via-blue-500 to-purple-500"></div>
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <BarChart3 className="text-cipher-400" /> Lab Analytics
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg hover:bg-slate-700">
             <X size={20} />
           </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Main Counters */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-20 bg-cipher-500/10 blur-[50px] rounded-full group-hover:bg-cipher-500/20 transition-all"></div>
                <Globe size={32} className="text-cipher-400 mb-2 relative z-10" />
                <div className="text-4xl font-black text-white relative z-10">{stats.totalVisits}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Total Lab Visits</div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 p-20 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                <Zap size={32} className="text-blue-400 mb-2 relative z-10" />
                <div className="text-xl font-bold text-white relative z-10">{mostPopular}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Most Used Algo</div>
            </div>

            {/* Algo Chart */}
            <div className="col-span-1 md:col-span-2 bg-black/40 p-6 rounded-xl border border-slate-800/50">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock size={14} /> Usage Distribution
                </h4>
                <div className="space-y-3">
                    {sortedAlgos.length === 0 ? (
                        <div className="text-slate-600 text-sm italic text-center py-4">No data collected yet. Start encrypting!</div>
                    ) : (
                        sortedAlgos.map(([algo, count], idx) => {
                            const max = sortedAlgos[0][1] as number;
                            const percent = ((count as number) / max) * 100;
                            return (
                                <div key={algo} className="group">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-300 font-bold">{algo}</span>
                                        <span className="text-slate-500">{count} runs</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-cipher-600 to-cipher-400 rounded-full group-hover:bg-cipher-300 transition-colors" 
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
        
        <div className="bg-slate-900/80 p-4 text-center border-t border-slate-800">
            <p className="text-[10px] text-slate-500">
                Data is stored locally in your browser. Clearing cache will reset these numbers.
            </p>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
