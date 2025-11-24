
import React from 'react';
import { Github, Heart, BookOpen, Code2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pb-8 px-8 border-t border-slate-800/50 pt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col gap-2">
            <h4 className="text-white font-bold flex items-center gap-2">
                <Code2 size={18} className="text-cipher-500" />
                CipherBlock Visualizer
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
                An open-source educational tool designed to demystify cryptographic algorithms through interactive visualization.
            </p>
        </div>

        <div className="flex flex-col items-center md:items-end text-right space-y-2">
             <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                <BookOpen size={12} className="text-blue-400"/>
                <span>Based on the teachings of <strong>Prof. Tay</strong> (NTU SCSE)</span>
             </div>
             
             <div className="flex items-center gap-4">
                <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1 group">
                    <Github size={12} />
                    <span className="group-hover:underline">Contribute on GitHub</span>
                </a>
                <span className="text-slate-700">•</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    Made with <Heart size={10} className="text-red-500 fill-red-500/20" /> by Students
                </span>
             </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
