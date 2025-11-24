import React from 'react';
import { BookOpen, ChevronRight, GraduationCap, Circle, PlayCircle, Lock } from 'lucide-react';
import { Lesson } from '../types';
import { lessons } from '../data/lessons';

interface LessonSidebarProps {
  currentLessonIndex: number;
  onSelectLesson: (index: number) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ currentLessonIndex, onSelectLesson }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950/50">
      <div className="p-6 border-b border-slate-800/50">
        <h2 className="text-white font-bold flex items-center gap-3 text-lg">
          <div className="bg-cipher-900/50 p-2 rounded-lg border border-cipher-500/20">
             <GraduationCap className="text-cipher-400" size={20} />
          </div>
          Curriculum
        </h2>
        <p className="text-xs text-slate-500 mt-2 pl-1">NTU SCSE 6104 • Cryptography</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {lessons.map((lesson, idx) => {
          const isActive = idx === currentLessonIndex;
          const isCompleted = idx < currentLessonIndex; // Simple logic for now
          
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-cipher-900/20 border-cipher-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)] translate-x-1' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cipher-500"></div>
              )}
              
              <div className="flex justify-between items-start mb-2 pl-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-cipher-400' : 'text-slate-500'}`}>
                    Module 0{idx}
                </span>
                {lesson.slideRef && (
                  <span className="text-[9px] bg-black/40 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800/50 font-mono">
                    {lesson.slideRef}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 pl-2">
                 <div className={`p-1.5 rounded-full border ${isActive ? 'bg-cipher-500 text-slate-950 border-cipher-400' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                    {isActive ? <PlayCircle size={14} /> : <Circle size={14} />}
                 </div>
                 <span className={`text-sm font-semibold leading-tight ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {lesson.title.split(': ')[1] || lesson.title}
                 </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-800/50 text-[10px] text-slate-600 text-center font-mono">
        v1.0.0 • Lab Environment
      </div>
    </div>
  );
};

export default LessonSidebar;