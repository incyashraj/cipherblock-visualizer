
import { CipherMode, CryptoAlgorithm, KeyType } from '../types';
import { runDES, run3DES, runFeistelDemo } from './des';

export const stringToBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

export const bufferToString = (buf: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  return decoder.decode(buf);
};

export const bufferToHex = (buf: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const hexToBuffer = (hex: string): ArrayBuffer | null => {
  if (!hex) return new ArrayBuffer(0);
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
  if (cleanHex.length % 2 !== 0) return null;
  
  const len = cleanHex.length / 2;
  const uint8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return uint8.buffer;
};

export const generateRandomHexKey = (bitLength: number): string => {
  const byteLength = bitLength / 8;
  const arr = new Uint8Array(byteLength);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const flipBit = (buffer: ArrayBuffer, byteOffset: number, bitOffset: number): ArrayBuffer => {
    const newArr = new Uint8Array(buffer.slice(0));
    if (byteOffset < newArr.length) {
        newArr[byteOffset] ^= (1 << bitOffset);
    }
    return newArr.buffer;
};

export const calculateBitDiff = (buf1: ArrayBuffer, buf2: ArrayBuffer): { diffBits: number, totalBits: number, diffIndices: number[] } => {
    const arr1 = new Uint8Array(buf1);
    const arr2 = new Uint8Array(buf2);
    const len = Math.min(arr1.length, arr2.length);
    
    let diffBits = 0;
    const diffIndices: number[] = []; // Byte indices that are different
    
    for(let i=0; i<len; i++) {
        let xorVal = arr1[i] ^ arr2[i];
        if (xorVal !== 0) diffIndices.push(i);
        while(xorVal > 0) {
            diffBits += xorVal & 1;
            xorVal >>= 1;
        }
    }
    
    return {
        diffBits,
        totalBits: len * 8,
        diffIndices
    };
};

export const applyPKCS7Padding = (data: ArrayBuffer, blockSize: number = 16): ArrayBuffer => {
  const dataArr = new Uint8Array(data);
  const padLen = blockSize - (dataArr.length % blockSize);
  const paddedArr = new Uint8Array(dataArr.length + padLen);
  paddedArr.set(dataArr);
  paddedArr.fill(padLen, dataArr.length);
  return paddedArr.buffer;
};

// --- Classical Cipher Implementations ---

const runCaesar = (text: string, key: string, decrypt: boolean): string => {
    const shift = (parseInt(key) || 3) * (decrypt ? -1 : 1);
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    });
};

const runVigenere = (text: string, key: string, decrypt: boolean): string => {
    const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanKey) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-zA-Z]/)) {
            const base = char <= 'Z' ? 65 : 97;
            const shift = (cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65) * (decrypt ? -1 : 1);
            result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
};

const runRC4 = (data: Uint8Array, key: Uint8Array): Uint8Array => {
    if (key.length === 0) return data;
    
    // Key Scheduling Algorithm (KSA)
    const S = Array.from({length: 256}, (_, i) => i);
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + S[i] + key[i % key.length]) % 256;
        [S[i], S[j]] = [S[j], S[i]];
    }
    
    // Pseudo-Random Generation Algorithm (PRGA) & XOR
    let i = 0; 
    j = 0;
    const output = new Uint8Array(data.length);
    for (let k = 0; k < data.length; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        [S[i], S[j]] = [S[j], S[i]];
        const t = (S[i] + S[j]) % 256;
        const keystreamByte = S[t];
        output[k] = data[k] ^ keystreamByte;
    }
    return output;
};

// ----------------------------------------

// Generate AES Key or Return Raw Bytes for others
export const generateOrImportKey = async (
  type: KeyType, 
  value: string, 
  algo: CryptoAlgorithm
): Promise<CryptoKey | Uint8Array | null> => {
  
  // For Classical Ciphers, the key is just the string
  if (algo === CryptoAlgorithm.Caesar || algo === CryptoAlgorithm.Vigenere) {
      const enc = new TextEncoder();
      return enc.encode(value); // Store as bytes but will convert back to string
  }
  
  // For RC4/LFSR (stream), interpret key string as bytes
  if (algo === CryptoAlgorithm.RC4 || algo === CryptoAlgorithm.LFSR) {
      const enc = new TextEncoder();
      return enc.encode(value);
  }

  if (type === KeyType.PASSPHRASE) {
      if (algo === CryptoAlgorithm.AES) {
        // PBKDF2 for AES
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(value),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        const fixedSalt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        return window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: fixedSalt, iterations: 1000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
      } else {
          // For DES/3DES, derive bytes using simple SHA-256 then truncate
          const enc = new TextEncoder();
          const hash = await window.crypto.subtle.digest("SHA-256", enc.encode(value));
          const bytes = new Uint8Array(hash);
          if (algo === CryptoAlgorithm.DES) return bytes.slice(0, 8); // 64 bits
          if (algo === CryptoAlgorithm.TripleDES) return bytes.slice(0, 24); // 192 bits
          if (algo === CryptoAlgorithm.Feistel) return bytes.slice(0, 8);
      }
  } else {
      // Hex Input
      const buf = hexToBuffer(value);
      if (!buf) return null;
      
      if (algo === CryptoAlgorithm.AES) {
          // Import Raw Key
          try {
             return await window.crypto.subtle.importKey(
                 "raw",
                 buf,
                 "AES-CBC", // Algo name is generic here for import
                 true,
                 ["encrypt", "decrypt"]
             );
          } catch(e) {
              console.error("Invalid AES Key length", e);
              return null;
          }
      } else {
          // Raw bytes for DES
          return new Uint8Array(buf);
      }
  }
  return null;
};

export const generateIV = (mode: CipherMode, algo: CryptoAlgorithm): Uint8Array => {
  // GCM 12 bytes, AES others 16 bytes
  // DES/3DES 8 bytes
  // Classical ciphers don't need IV
  let length = 16;
  if (algo === CryptoAlgorithm.AES) {
      length = mode === CipherMode.GCM ? 12 : 16;
  } else if (algo === CryptoAlgorithm.DES || algo === CryptoAlgorithm.TripleDES) {
      length = 8; // DES block size
  } else {
      return new Uint8Array(0);
  }
  return window.crypto.getRandomValues(new Uint8Array(length));
};

export const encryptData = async (
  algo: CryptoAlgorithm,
  mode: CipherMode,
  key: CryptoKey | Uint8Array,
  iv: Uint8Array,
  data: string
): Promise<ArrayBuffer> => {
  if (algo === CryptoAlgorithm.Caesar || algo === CryptoAlgorithm.Vigenere) {
      const keyStr = new TextDecoder().decode(key as Uint8Array);
      let result = "";
      if (algo === CryptoAlgorithm.Caesar) result = runCaesar(data, keyStr, false);
      else result = runVigenere(data, keyStr, false);
      return stringToBuffer(result);
  }

  const dataBytes = stringToBuffer(data);
  return encryptBuffer(algo, mode, key, iv, dataBytes);
};

// Helper to encrypt raw buffer directly (re-used by visualizers)
export const encryptBuffer = async (
  algo: CryptoAlgorithm,
  mode: CipherMode,
  key: CryptoKey | Uint8Array,
  iv: Uint8Array,
  dataBytes: ArrayBuffer
): Promise<ArrayBuffer> => {
  if (algo === CryptoAlgorithm.AES) {
      const k = key as CryptoKey;
      const algConfig = {
        name: mode === CipherMode.GCM ? 'AES-GCM' : mode === CipherMode.CTR ? 'AES-CTR' : 'AES-CBC',
        iv: iv,
        counter: iv, 
        length: 64,
      };
      return window.crypto.subtle.encrypt(algConfig, k, dataBytes);
  } else if (algo === CryptoAlgorithm.DES) {
      // DES
      const k = key as Uint8Array;
      const res = runDES(mode === CipherMode.CBC ? 'CBC' : 'ECB', k, iv, new Uint8Array(dataBytes), false);
      return res.buffer;
  } else if (algo === CryptoAlgorithm.TripleDES) {
      const k = key as Uint8Array;
      const res = run3DES(mode === CipherMode.CBC ? 'CBC' : 'ECB', k, iv, new Uint8Array(dataBytes), false);
      return res.buffer;
  } else if (algo === CryptoAlgorithm.RC4) {
      // RC4
      const k = key as Uint8Array;
      const res = runRC4(new Uint8Array(dataBytes), k);
      return res.buffer;
  } else if (algo === CryptoAlgorithm.LFSR) {
      // Placeholder for LFSR basic XOR, could implement proper seeded LFSR stream but RC4 is sufficient for stream demo
      // For now, just pass through or simple XOR with key to show change
      const k = key as Uint8Array;
      const res = runRC4(new Uint8Array(dataBytes), k); // Reuse RC4 logic for stream demo if key available
      return res.buffer;
  } else if (algo === CryptoAlgorithm.Feistel) {
      // Demo only, not real encryption for full text
      return dataBytes; 
  }
  // Fallback for classical visualizer calls that might pass through here (though they typically use encryptData)
  return dataBytes;
};

export const decryptData = async (
  algo: CryptoAlgorithm,
  mode: CipherMode,
  key: CryptoKey | Uint8Array,
  iv: Uint8Array,
  ciphertext: ArrayBuffer
): Promise<string> => {
  try {
    if (algo === CryptoAlgorithm.Caesar || algo === CryptoAlgorithm.Vigenere) {
        const keyStr = new TextDecoder().decode(key as Uint8Array);
        const cipherStr = bufferToString(ciphertext);
        if (algo === CryptoAlgorithm.Caesar) return runCaesar(cipherStr, keyStr, true);
        else return runVigenere(cipherStr, keyStr, true);
    }

    if (algo === CryptoAlgorithm.AES) {
        const k = key as CryptoKey;
        const algConfig = {
            name: mode === CipherMode.GCM ? 'AES-GCM' : mode === CipherMode.CTR ? 'AES-CTR' : 'AES-CBC',
            iv: iv,
            counter: iv,
            length: 64,
        };
        const decrypted = await window.crypto.subtle.decrypt(algConfig, k, ciphertext);
        return bufferToString(decrypted);
    } else {
        const k = key as Uint8Array;
        const bytes = new Uint8Array(ciphertext);
        let res: Uint8Array;
        
        if (algo === CryptoAlgorithm.DES) {
            res = runDES(mode === CipherMode.CBC ? 'CBC' : 'ECB', k, iv, bytes, true);
        } else if (algo === CryptoAlgorithm.TripleDES) {
            res = run3DES(mode === CipherMode.CBC ? 'CBC' : 'ECB', k, iv, bytes, true);
        } else if (algo === CryptoAlgorithm.RC4 || algo === CryptoAlgorithm.LFSR) {
            // Symmetric stream cipher
            res = runRC4(bytes, k);
        } else {
            return "Demo Mode";
        }
        return bufferToString(res.buffer);
    }
  } catch (e) {
    console.error("Decryption failed", e);
    return "Decryption Error";
  }
};

export const chunkBuffer = (buffer: ArrayBuffer, blockSize: number = 16): number[][] => {
  const uint8 = new Uint8Array(buffer);
  const chunks: number[][] = [];
  for (let i = 0; i < uint8.length; i += blockSize) {
    const chunk = Array.from(uint8.slice(i, i + blockSize));
    chunks.push(chunk);
  }
  return chunks;
};
