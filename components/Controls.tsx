
import React, { useState } from 'react';
import { CipherMode, CryptoAlgorithm, KeyType } from '../types';
import { generateRandomHexKey } from '../utils/cryptoUtils';
import { Key, RefreshCw, Settings, Shield, Unlock, BookOpen, AlertTriangle, Info, Database, Layers, Dices, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlsProps {
  passphrase: string;
  setPassphrase: (s: string) => void;
  plaintext: string;
  setPlaintext: (s: string) => void;
  mode: CipherMode;
  setMode: (m: CipherMode) => void;
  algorithm: CryptoAlgorithm;
  setAlgorithm: (a: CryptoAlgorithm) => void;
  keyType: KeyType;
  setKeyType: (k: KeyType) => void;
  ivHex: string;
  regenerateIV: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  passphrase,
  setPassphrase,
  plaintext,
  setPlaintext,
  mode,
  setMode,
  algorithm,
  setAlgorithm,
  keyType,
  setKeyType,
  ivHex,
  regenerateIV,
}) => {
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  
  const isAES = algorithm === CryptoAlgorithm.AES;
  const isDemo = algorithm === CryptoAlgorithm.Feistel || algorithm === CryptoAlgorithm.LFSR || algorithm === CryptoAlgorithm.RC4 || algorithm === CryptoAlgorithm.Enigma || algorithm === CryptoAlgorithm.Caesar || algorithm === CryptoAlgorithm.Vigenere;
  const isBirthday = keyType === KeyType.NUMERIC; // Hacky check for birthday view

  const handleGenerateKey = (bits: number) => {
      const hex = generateRandomHexKey(bits);
      setKeyType(KeyType.HEX);
      setPassphrase(hex);
  };

  // Validation Logic for Visual Feedback
  const getValidationStatus = () => {
    if (!passphrase) return 'neutral';
    
    if (algorithm === CryptoAlgorithm.Caesar) {
       return /^-?\d+$/.test(passphrase) ? 'valid' : 'invalid';
    }
    
    if (keyType === KeyType.PASSPHRASE) {
        return passphrase.length > 0 ? 'valid' : 'neutral';
    }
    
    if (keyType === KeyType.HEX) {
        if (!/^[0-9A-Fa-f]+$/.test(passphrase)) return 'invalid';
        
        if (isAES) {
             return [32, 48, 64].includes(passphrase.length) ? 'valid' : 'invalid';
        }
        if (algorithm === CryptoAlgorithm.DES) {
             return passphrase.length === 16 ? 'valid' : 'invalid';
        }
        if (algorithm === CryptoAlgorithm.TripleDES) {
             return [32, 48].includes(passphrase.length) ? 'valid' : 'invalid';
        }
        // Generic hex check for others (ensure even length usually)
        return passphrase.length % 2 === 0 ? 'valid' : 'invalid';
    }
    return 'neutral';
  };

  const validationStatus = getValidationStatus();

  const statusClasses = {
    neutral: '',
    valid: '!border-cipher-500 !focus:border-cipher-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-cipher-950/20',
    invalid: '!border-red-500 !focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-950/20'
  };

  const iconClasses = {
      neutral: 'text-slate-500 group-focus-within:text-cipher-400',
      valid: 'text-cipher-400',
      invalid: 'text-red-400'
  };

  return (
    <div className="flex flex-col gap-6 glass-panel p-6 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 text-white border-b border-slate-700/50 pb-4">
        <div className="bg-slate-800 p-2 rounded-lg">
            <Settings size={18} className="text-cipher-400" />
        </div>
        <h2 className="text-lg font-bold tracking-tight">Configuration</h2>
      </div>

      {/* Algorithm Selection */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database size={14} /> Encryption Algo
            </label>
        </div>
        <div className="relative">
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as CryptoAlgorithm)}
              className="w-full input-tech rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-cipher-500/50 appearance-none cursor-pointer"
            >
              <optgroup label="Classical (Week 1)">
                <option value={CryptoAlgorithm.Caesar}>Caesar Cipher</option>
                <option value={CryptoAlgorithm.Vigenere}>Vigenère Cipher</option>
              </optgroup>
              <optgroup label="Stream Ciphers (Week 1-2)">
                <option value={CryptoAlgorithm.RC4}>RC4 (Rivest Cipher 4)</option>
                <option value={CryptoAlgorithm.LFSR}>LFSR (Linear Feedback Shift Register)</option>
              </optgroup>
              <optgroup label="Block Ciphers">
                <option value={CryptoAlgorithm.AES}>AES (Advanced Encryption Standard)</option>
                <option value={CryptoAlgorithm.DES}>DES (Data Encryption Standard)</option>
                <option value={CryptoAlgorithm.TripleDES}>3DES (Triple DES)</option>
              </optgroup>
              <optgroup label="Educational">
                <option value={CryptoAlgorithm.Feistel}>Feistel Visualizer</option>
                <option value={CryptoAlgorithm.Enigma}>Enigma Machine (History)</option>
              </optgroup>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 border-r border-b border-slate-400 rotate-45 transform translate-y-[-2px]"></div>
            </div>
        </div>
        
        {!isAES && !isDemo && (
             <div className="flex items-start gap-3 bg-yellow-950/30 text-yellow-500 p-3 rounded-lg text-xs border border-yellow-500/20">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>
                   <strong>Warning:</strong> {algorithm} is considered obsolete and insecure. It is shown here for historical context only.
                </span>
             </div>
        )}
      </div>

      {!isDemo && (
      <>
      {/* Algorithm Mode */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} /> Operation Mode
        </label>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 relative">
          {Object.values(CipherMode)
            .filter(m => isAES ? true : (m === 'CBC' || m === 'ECB'))
            .filter(m => m !== 'STREAM')
            .map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-300 ${
                mode === m
                  ? 'bg-gradient-to-br from-cipher-500 to-cipher-600 text-white shadow-lg shadow-cipher-500/30 scale-110 z-10 ring-1 ring-cipher-400/50'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {m.replace('AES-', '')}
            </button>
          ))}
        </div>
        
        {/* Educational Context for Mode */}
        <div className="text-xs mt-1 p-3 rounded-lg bg-black/20 border border-slate-800/50 backdrop-blur-sm">
            {mode === CipherMode.ECB && (
                <span className="text-yellow-400 flex gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>
                        <strong>ECB (Electronic Codebook):</strong> Insecure for most uses. Patterns in plaintext remain visible in ciphertext.
                    </span>
                </span>
            )}
            {mode === CipherMode.CBC && (
                <span className="text-cipher-300 flex gap-2">
                    <Shield size={14} className="shrink-0 mt-0.5" />
                    <span>
                        <strong>CBC (Cipher Block Chaining):</strong> Secure pattern hiding. Uses previous block + IV to scramble data.
                    </span>
                </span>
            )}
        </div>
      </div>

      {/* IV Display/Control */}
      {mode !== CipherMode.ECB && (
      <div className="space-y-3">
         <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Shield size={14} /> IV (Initialization Vector)
          </label>
          <button 
            onClick={regenerateIV}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors border border-slate-600"
          >
            <RefreshCw size={10} /> REGEN
          </button>
        </div>
        <div className="font-mono text-xs bg-black/40 p-3 rounded-lg border border-slate-800 text-slate-400 break-all shadow-inner">
          {ivHex || <span className="text-slate-600 italic">Generating secure random values...</span>}
        </div>
      </div>
      )}
      </>
      )}

      {/* Secret Key Input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Key size={14} /> Secret Key {algorithm === CryptoAlgorithm.Caesar && "(Shift Amount)"}
          </label>
          {!isBirthday && algorithm !== CryptoAlgorithm.Caesar && (
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
             <button 
                onClick={() => { setKeyType(KeyType.PASSPHRASE); setPassphrase(""); }}
                className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${keyType === KeyType.PASSPHRASE ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
             >TEXT</button>
             <button 
                onClick={() => { setKeyType(KeyType.HEX); setPassphrase(""); }}
                className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${keyType === KeyType.HEX ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
             >HEX</button>
          </div>
          )}
        </div>
        
        {!isBirthday && (
        <>
            <div className="relative group">
                <input
                type={algorithm === CryptoAlgorithm.Caesar ? "number" : "text"}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className={`
                    w-full input-tech rounded-lg pl-10 pr-4 py-3 text-white outline-none font-mono text-sm placeholder-slate-600 transition-all
                    ${statusClasses[validationStatus]}
                `}
                placeholder={algorithm === CryptoAlgorithm.Caesar ? "Shift amount (e.g. 3)" : (keyType === KeyType.PASSPHRASE ? "Enter secret passphrase..." : (isAES ? "Hex string (32/48/64 chars)" : "Hex string"))}
                />
                <Key size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${iconClasses[validationStatus]}`} />
                
                {/* Optional small feedback label */}
                {validationStatus === 'invalid' && keyType === KeyType.HEX && (
                    <div className="absolute -bottom-5 right-0 text-[9px] text-red-400 font-bold animate-in fade-in slide-in-from-top-1">
                        Invalid Length or Characters
                    </div>
                )}
            </div>

            {/* Random Key Generation Tools */}
            {!isDemo && (
                <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Dices size={12} /> Generate Secure Random Key
                        </label>
                        <button onClick={() => setShowKeyInfo(!showKeyInfo)} className="text-slate-500 hover:text-cipher-400 transition-colors">
                            <Info size={12} />
                        </button>
                    </div>

                    {showKeyInfo && (
                        <div className="mb-3 p-3 bg-cipher-950/30 border border-cipher-500/20 rounded-lg text-xs text-slate-300 animate-in fade-in slide-in-from-top-2">
                             <h5 className="font-bold text-cipher-400 mb-1 flex items-center gap-1"><Shield size={12}/> Cryptographically Secure (CSPRNG)</h5>
                             <p>
                                Keys are generated using <code>window.crypto.getRandomValues()</code>, which uses the OS's entropy pool (noise, interrupts) to create truly unpredictable numbers, unlike <code>Math.random()</code>.
                             </p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                        {isAES ? (
                            <>
                                <button onClick={() => handleGenerateKey(128)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 rounded border border-slate-700 hover:border-cipher-500/50 transition-all">128-bit</button>
                                <button onClick={() => handleGenerateKey(192)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 rounded border border-slate-700 hover:border-cipher-500/50 transition-all">192-bit</button>
                                <button onClick={() => handleGenerateKey(256)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 rounded border border-slate-700 hover:border-cipher-500/50 transition-all">256-bit</button>
                            </>
                        ) : (
                           <button onClick={() => handleGenerateKey(64)} className="col-span-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 rounded border border-slate-700 hover:border-cipher-500/50 transition-all">Generate 64-bit Hex Key</button> 
                        )}
                    </div>
                </div>
            )}
        </>
        )}
      </div>

      {/* Birthday Paradox / RC4 Special Controls */}
      {isBirthday && (
          <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Number of People</label>
              <input 
                type="number" 
                value={plaintext} 
                onChange={(e) => setPlaintext(e.target.value)} 
                className="w-full input-tech rounded-lg px-4 py-3 text-white outline-none"
                placeholder="Enter number (e.g. 23)"
              />
          </div>
      )}

      {/* Plaintext Input (Hidden for Birthday Paradox) */}
      {!isBirthday && (
      <div className="space-y-3 pt-6 border-t border-slate-700/50">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          {isDemo ? <BookOpen size={14} /> : <Unlock size={14} />} 
          {isDemo ? "Demo Input" : "Plaintext Message"}
        </label>
        <div className="relative">
            <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            rows={4}
            maxLength={isDemo && algorithm === CryptoAlgorithm.Feistel ? 8 : undefined}
            className="w-full input-tech rounded-lg px-4 py-3 text-white outline-none font-mono text-sm placeholder-slate-600 resize-none transition-all shadow-inner"
            placeholder={isDemo ? "Input data..." : "Type the secret message here..."}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">
             {plaintext.length} chars
            </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Controls;
