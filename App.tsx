
import React, { useState, useEffect, useCallback } from 'react';
import { 
  CipherMode, 
  CryptoAlgorithm,
  KeyType,
  VisualizerType
} from './types';
import { 
  generateOrImportKey, 
  generateIV, 
  encryptData, 
  decryptData, 
  bufferToHex, 
  hexToBuffer, 
  chunkBuffer, 
  stringToBuffer,
  applyPKCS7Padding 
} from './utils/cryptoUtils';
import { trackVisit, trackAlgoUsage } from './utils/analytics';
import Controls from './components/Controls';
import HexBlock from './components/HexBlock';
import RoundVisualizer from './components/RoundVisualizer';
import AvalancheVisualizer from './components/AvalancheVisualizer';
import SBoxVisualizer from './components/SBoxVisualizer';
import { BirthdayVisualizer, LFSRVisualizer, RC4Visualizer } from './components/StreamVisualizers';
import LessonSidebar from './components/LessonSidebar';
import Footer from './components/Footer';
import FactWidget from './components/FactWidget';
import StatsModal from './components/StatsModal';
import { lessons } from './data/lessons';
import { Lock, ArrowRight, ArrowDown, Activity, Terminal, Menu, X, CheckCircle, ChevronLeft, ShieldCheck, Key, Unlock, Copy, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  // Lesson State
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Crypto State
  const [passphrase, setPassphrase] = useState("");
  const [keyType, setKeyType] = useState<KeyType>(KeyType.PASSPHRASE);
  const [plaintext, setPlaintext] = useState("");
  const [mode, setMode] = useState<CipherMode>(CipherMode.CBC);
  const [algorithm, setAlgorithm] = useState<CryptoAlgorithm>(CryptoAlgorithm.AES);
  
  const [ivHex, setIvHex] = useState<string>("");
  const [keyObj, setKeyObj] = useState<CryptoKey | Uint8Array | null>(null);
  
  // View State
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('standard');
  
  // Encrypted Results
  const [ciphertextBuffer, setCiphertextBuffer] = useState<ArrayBuffer | null>(null);
  const [decryptedText, setDecryptedText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize Analytics
  useEffect(() => {
    trackVisit();
  }, []);

  // Track Algorithm Usage
  useEffect(() => {
    trackAlgoUsage(algorithm);
  }, [algorithm]);

  // Apply Lesson Config when lesson changes
  useEffect(() => {
    const config = lessons[currentLessonIndex].config;
    setAlgorithm(config.algorithm);
    setMode(config.mode);
    setPlaintext(config.defaultPlaintext);
    setPassphrase(config.defaultKey);
    setKeyType(config.defaultKeyType);
    setVisualizerType(config.visualizer);
  }, [currentLessonIndex]);

  // Initialize Key and IV on mount or passphrase/algo change
  useEffect(() => {
    const initKey = async () => {
      try {
        if (!passphrase && keyType !== KeyType.NUMERIC) { // Skip key check for numeric input (Birthday)
            setKeyObj(null);
            return;
        }
        // For Demo visualizers that don't use real crypto keys, skip or simplify
        if (algorithm === CryptoAlgorithm.Enigma) {
            setKeyObj(new Uint8Array([])); // Dummy
            return;
        }

        const k = await generateOrImportKey(keyType, passphrase, algorithm);
        setKeyObj(k);
        setError(null);
      } catch (e) {
        setKeyObj(null);
        setError("Invalid Key Format");
      }
    };
    initKey();
  }, [passphrase, keyType, algorithm]);

  // Regenerate IV when Mode or Algo changes
  const refreshIV = useCallback(() => {
    const iv = generateIV(mode, algorithm);
    setIvHex(bufferToHex(iv.buffer));
  }, [mode, algorithm]);

  useEffect(() => {
    refreshIV();
  }, [refreshIV]);

  // Perform Encryption/Decryption Loop
  useEffect(() => {
    const processCrypto = async () => {
      // Skip for purely mathematical visualizers that don't involve encrypting the plaintext buffer
      if (visualizerType === 'birthday') return;
      
      // Check Requirements
      if (!keyObj && keyType !== KeyType.NUMERIC) return;
      
      // IV Check: Only needed for Block Ciphers in non-ECB mode
      const isBlockCipher = algorithm === CryptoAlgorithm.AES || algorithm === CryptoAlgorithm.DES || algorithm === CryptoAlgorithm.TripleDES;
      const needsIV = isBlockCipher && mode !== CipherMode.ECB;
      
      if (needsIV && !ivHex) return;

      try {
        let ivBuf = new ArrayBuffer(0);
        if (needsIV) {
            const buf = hexToBuffer(ivHex);
            if (!buf) return;
            ivBuf = buf;
        }

        const encrypted = await encryptData(algorithm, mode, keyObj!, new Uint8Array(ivBuf), plaintext);
        setCiphertextBuffer(encrypted);

        const decrypted = await decryptData(algorithm, mode, keyObj!, new Uint8Array(ivBuf), encrypted);
        setDecryptedText(decrypted);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Encryption failed. Check key length or input.");
        setCiphertextBuffer(null);
        setDecryptedText("");
      }
    };

    const timer = setTimeout(processCrypto, 300);
    return () => clearTimeout(timer);
  }, [plaintext, keyObj, ivHex, mode, algorithm, visualizerType, keyType]);

  const handleCopyHex = () => {
      if (ciphertextBuffer) {
          navigator.clipboard.writeText(bufferToHex(ciphertextBuffer));
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  // Prepare chunks for standard visualization
  const blockSize = (algorithm === CryptoAlgorithm.AES) ? 16 : 8;
  const plainBuffer = stringToBuffer(plaintext);
  
  // Apply manual PKCS#7 padding just for visualization purposes
  const isBlockCipher = algorithm === CryptoAlgorithm.AES || algorithm === CryptoAlgorithm.DES || algorithm === CryptoAlgorithm.TripleDES;
  const bufferToChunk = isBlockCipher ? applyPKCS7Padding(plainBuffer, blockSize) : plainBuffer;
  
  const plainChunks = chunkBuffer(bufferToChunk, blockSize);
  
  // Padding length for last block visualization
  const paddingLength = isBlockCipher ? (blockSize - (plainBuffer.byteLength % blockSize)) : 0;

  const cipherChunks = ciphertextBuffer ? chunkBuffer(ciphertextBuffer, blockSize) : [];
  
  // Decrypted Chunks (re-buffer the decrypted text to show blocks)
  const decryptedBuffer = stringToBuffer(decryptedText);
  // For visual symmetry, apply padding logic to decrypted view if it matches input
  const decryptedBufferToChunk = isBlockCipher && decryptedText === plaintext ? applyPKCS7Padding(decryptedBuffer, blockSize) : decryptedBuffer;
  const decryptedChunks = chunkBuffer(decryptedBufferToChunk, blockSize);

  const currentLesson = lessons[currentLessonIndex];
  const showOutputPanel = visualizerType === 'standard' || visualizerType === 'rc4' || visualizerType === 'lfsr';

  return (
    <div className="h-screen font-sans selection:bg-cipher-500/30 selection:text-cipher-100 flex flex-col overflow-hidden">
      
      {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} />}
      <FactWidget />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b-0 border-b-slate-800/50 z-50 flex items-center justify-between px-4 lg:px-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cipher-600 to-cipher-800 p-2 rounded-lg shadow-lg shadow-cipher-500/20 animate-glow">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">CipherBlock <span className="text-cipher-500">Visualizer</span></h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Interactive Lab</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-slate-800/50 backdrop-blur-sm">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Algorithm</span>
                    <span className="text-xs font-mono text-cipher-400 font-bold">{algorithm}</span>
                 </div>
                 {mode !== CipherMode.STREAM && (
                 <>
                   <div className="h-6 w-[1px] bg-slate-800"></div>
                   <div className="flex flex-col items-start">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mode</span>
                      <span className="text-xs font-mono text-cipher-400 font-bold">{mode}</span>
                   </div>
                 </>
                 )}
             </div>

             <button 
                onClick={() => setShowStatsModal(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="View Analytics"
             >
                <BarChart3 size={20} />
             </button>
          </div>
      </header>

      <div className="flex flex-1 pt-16 overflow-hidden relative">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 glass-panel border-r border-slate-800/50 flex-shrink-0 z-40">
          <LessonSidebar 
            currentLessonIndex={currentLessonIndex}
            onSelectLesson={setCurrentLessonIndex}
          />
        </aside>

        {/* Sidebar (Mobile Overlay) */}
        {showMobileSidebar && (
          <div className="absolute inset-0 z-50 lg:hidden flex">
            <div className="w-72 bg-slate-950 border-r border-slate-800 h-full shadow-2xl relative">
              <button 
                onClick={() => setShowMobileSidebar(false)}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <LessonSidebar 
                currentLessonIndex={currentLessonIndex}
                onSelectLesson={(i) => { setCurrentLessonIndex(i); setShowMobileSidebar(false); }}
              />
            </div>
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)}></div>
          </div>
        )}

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            
            {/* Lesson Content Card */}
            <div className="glass-panel rounded-2xl p-0 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-6 md:p-8 relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cipher-400 to-cipher-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-cipher-500 uppercase tracking-widest bg-cipher-950/50 border border-cipher-500/20 px-2 py-0.5 rounded">Module {currentLessonIndex}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{currentLesson.title}</h2>
                    </div>
                    {currentLesson.slideRef && (
                        <div className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                          Ref: {currentLesson.slideRef}
                        </div>
                    )}
                  </div>
                  
                  <div 
                      className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-cipher-300 max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content as string }}
                  ></div>
               </div>

               {/* Footer Navigation */}
               <div className="bg-black/20 p-4 border-t border-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                  <button 
                    onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {currentLessonIndex < lessons.length - 1 ? (
                    <button
                      onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                      className="group flex items-center gap-2 bg-gradient-to-r from-cipher-600 to-cipher-500 hover:from-cipher-500 hover:to-cipher-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-cipher-500/20 hover:shadow-cipher-500/40 translate-y-0 hover:-translate-y-0.5"
                    >
                      Next Module <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="text-cipher-400 text-sm font-bold flex items-center gap-2 bg-cipher-950/50 px-4 py-2 rounded-lg border border-cipher-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      <CheckCircle size={16} /> Course Complete
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Controls Column */}
              <div className="xl:col-span-4 space-y-6">
                <Controls 
                  passphrase={passphrase} 
                  setPassphrase={setPassphrase}
                  plaintext={plaintext}
                  setPlaintext={setPlaintext}
                  mode={mode}
                  setMode={setMode}
                  algorithm={algorithm}
                  setAlgorithm={setAlgorithm}
                  keyType={keyType}
                  setKeyType={setKeyType}
                  ivHex={ivHex}
                  regenerateIV={refreshIV}
                />

                {showOutputPanel && (
                <div className="glass-panel p-5 rounded-2xl shadow-lg animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 text-slate-400 mb-4 border-b border-slate-800/50 pb-2">
                      <Terminal size={16} />
                      <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">System Log</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Key Status</label>
                        <div className={`font-mono text-[10px] leading-relaxed break-all bg-black/40 p-3 rounded-lg border transition-colors ${keyObj ? 'border-cipher-500/30 text-cipher-300' : 'border-red-500/30 text-red-400'}`}>
                          {keyObj 
                              ? (keyType === KeyType.HEX ? "> RAW_KEY_LOADED_OK" : (algorithm === CryptoAlgorithm.Caesar || algorithm === CryptoAlgorithm.Vigenere ? "> CLASSICAL_KEY_SET" : "> KEY_DERIVATION_COMPLETE")) 
                              : "> ERROR: MISSING_OR_INVALID_KEY"}
                        </div>
                      </div>
                      {algorithm !== CryptoAlgorithm.Feistel && algorithm !== CryptoAlgorithm.Enigma && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Integrity Check</label>
                        <div className={`font-mono text-xs p-3 rounded-lg border flex items-center gap-2 ${decryptedText === plaintext ? 'text-cipher-300 border-cipher-500/20 bg-cipher-500/5' : 'text-red-300 border-red-500/20 bg-red-500/5'}`}>
                          {error ? (
                            <><X size={14} /> <span>{error}</span></>
                          ) : (
                            decryptedText === plaintext 
                             ? <><CheckCircle size={14} /> <span>Decryption Successful</span></>
                             : <span className="text-slate-500 animate-pulse">Processing...</span>
                          )}
                        </div>
                      </div>
                      )}
                    </div>
                </div>
                )}
              </div>

              {/* Visualization Column */}
              <div className="xl:col-span-8">
                
                {/* 1. Feistel View */}
                {visualizerType === 'feistel' && (
                     <RoundVisualizer input={plaintext} inputKey={passphrase} />
                )}

                {/* 2. Avalanche View */}
                {visualizerType === 'avalanche' && (
                    <AvalancheVisualizer 
                        algorithm={algorithm}
                        mode={mode}
                        keyObj={keyObj}
                        ivHex={ivHex}
                        plaintext={plaintext}
                    />
                )}

                {/* 3. S-Box View */}
                {visualizerType === 'sbox' && (
                    <SBoxVisualizer />
                )}

                {/* 4. Birthday Paradox View */}
                {visualizerType === 'birthday' && (
                    <BirthdayVisualizer input={plaintext} />
                )}

                {/* 5. LFSR View */}
                {visualizerType === 'lfsr' && (
                    <LFSRVisualizer />
                )}

                 {/* 6. RC4 View */}
                 {visualizerType === 'rc4' && (
                    <RC4Visualizer inputKey={passphrase} />
                )}

                {/* 7. Standard Block View */}
                {visualizerType === 'standard' && (
                <div className="space-y-4 animate-in fade-in duration-700">
                  
                  {/* --- STAGE 1: INPUT --- */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-slate-700/50">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-transparent opacity-50"></div>
                    
                    <div className="flex justify-between items-end mb-6">
                      <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                        <span className="bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded shadow-lg">Step 1</span> 
                        Input Plaintext
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono border border-slate-800 px-2 py-1 rounded-md bg-black/20">Block Size: {blockSize * 8}-bit</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-start">
                      {plainChunks.map((chunk, i) => (
                        <HexBlock 
                          key={`plain-${i}`} 
                          data={chunk} 
                          index={i} 
                          label="PLAIN" 
                          variant="neutral"
                          paddingCount={i === plainChunks.length - 1 ? paddingLength : 0} 
                        />
                      ))}
                      {plainChunks.length === 0 && (
                        <div className="w-full h-20 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 gap-1">
                          <Terminal size={20} className="opacity-50" />
                          <span className="text-xs">Enter text to begin...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transition Arrow 1 */}
                  <div className="flex items-center justify-center relative z-10 -my-2">
                    <div className="bg-slate-950 border border-cipher-500/30 text-cipher-400 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-2 shadow-lg z-20">
                        <Lock size={12} />
                        ENCRYPT (+ Key)
                        <ArrowDown size={12} />
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center -z-10">
                        <div className="h-full w-[1px] bg-slate-800"></div>
                    </div>
                  </div>

                  {/* --- STAGE 2: CIPHERTEXT --- */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-cipher-500/30 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cipher-600 to-transparent"></div>
                    
                    <div className="flex justify-between items-end mb-6">
                      <h4 className="text-sm font-bold text-cipher-300 flex items-center gap-2 uppercase tracking-wider">
                        <span className="bg-cipher-600 text-slate-950 text-[10px] px-2 py-0.5 rounded shadow-lg shadow-cipher-500/20">Step 2</span>
                        Encrypted Output
                      </h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-start min-h-[80px]">
                      {/* IV Block */}
                      {isBlockCipher && mode !== CipherMode.ECB && (
                      <div className="opacity-70 hover:opacity-100 transition-all">
                          <HexBlock 
                            data={ivHex ? Array.from(new Uint8Array(hexToBuffer(ivHex) || new ArrayBuffer(0))) : []} 
                            index={-1} 
                            label="IV" 
                            variant="neutral"
                          />
                      </div>
                      )}

                      {isBlockCipher && mode !== CipherMode.ECB && cipherChunks.length > 0 && (
                         <div className="flex items-center justify-center h-24 text-slate-600 font-mono text-xl">+</div>
                      )}

                      {cipherChunks.map((chunk, i) => (
                        <HexBlock 
                          key={`cipher-${i}`} 
                          data={chunk} 
                          index={i} 
                          label="CIPHER" 
                          variant="encrypt" 
                        />
                      ))}
                      
                      {cipherChunks.length === 0 && (
                        <div className="text-slate-600 text-xs italic p-4">Waiting for input...</div>
                      )}
                    </div>
                    
                    {/* Full Hex Output String */}
                    {ciphertextBuffer && ciphertextBuffer.byteLength > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-[10px] text-slate-500 uppercase font-bold block">Raw Ciphertext (Hex)</label>
                        <button 
                            onClick={handleCopyHex}
                            className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                        >
                            {copied ? <CheckCircle size={10} className="text-cipher-500" /> : <Copy size={10} />}
                            {copied ? "COPIED" : "COPY HEX"}
                        </button>
                      </div>
                      <div className="bg-black/60 rounded-lg border border-slate-800 p-4 relative group hover:border-cipher-500/30 transition-colors shadow-inner">
                        <div className="font-mono text-xs text-cipher-400 break-all leading-relaxed tracking-wide selection:bg-cipher-500/20">
                          {bufferToHex(ciphertextBuffer)}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Transition Arrow 2 */}
                  <div className="flex items-center justify-center relative z-10 -my-2">
                    <div className="bg-slate-950 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-2 shadow-lg z-20">
                        <Unlock size={12} />
                        DECRYPT (- Key)
                        <ArrowDown size={12} />
                    </div>
                     <div className="absolute inset-0 flex justify-center items-center -z-10">
                        <div className="h-full w-[1px] bg-slate-800"></div>
                    </div>
                  </div>

                  {/* --- STAGE 3: DECRYPTED --- */}
                   <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-blue-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-60"></div>
                    
                    <div className="flex justify-between items-end mb-6">
                      <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2 uppercase tracking-wider">
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded shadow-lg">Step 3</span> 
                        Decrypted Verification
                      </h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-start">
                      {decryptedChunks.map((chunk, i) => (
                        <HexBlock 
                          key={`dec-${i}`} 
                          data={chunk} 
                          index={i} 
                          label="RECOVER" 
                          variant="decrypt"
                          paddingCount={i === decryptedChunks.length - 1 ? paddingLength : 0} 
                        />
                      ))}
                      {decryptedChunks.length === 0 && (
                        <div className="text-slate-600 text-xs italic p-4">Waiting for valid ciphertext...</div>
                      )}
                    </div>

                    {/* Final Text Match Check */}
                    {decryptedText && (
                        <div className="mt-6 flex items-center gap-3 p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg">
                            <CheckCircle size={18} className="text-blue-400" />
                            <span className="text-xs text-blue-200 font-mono">
                                Decrypted string matches original input: <strong>"{decryptedText}"</strong>
                            </span>
                        </div>
                    )}
                  </div>

                </div>
                )}
              </div>
            </div>

            {/* NEW FOOTER */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
