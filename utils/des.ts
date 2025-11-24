// Simplified DES/3DES Implementation for Educational Visualization
// Note: This is a pure JS implementation for demonstration. 
// It is NOT protected against side-channel attacks and should not be used for high-security production data.

// Permutation Tables
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
];

const FP = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
];

// Expansion P-box
const E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

// S-Boxes (Just S1 for brevity in this demo if we wanted to be minimal, but full DES needs all 8. 
// To save space in this demo, we will use a single S-box repeated or simplified logic if strictly for visual,
// but let's try to be compliant enough for "DES" label.)
// Using standard S1 for all for code compactness in this specific "Demo" constraint context 
// unless we want full 8. Let's use full standard S-boxes for correctness.

const S_BOXES = [
  // S1
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  // S2
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  // S3
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  // S4
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  // S5
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  // S6
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  // S7
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  // S8
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

const P = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25
];

// PC1 (Permuted Choice 1) - Key Schedule
const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
];

// PC2
const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// Bit Manipulation Helpers
const getBit = (data: Uint8Array, pos: number): number => {
  const byteIndex = Math.floor((pos - 1) / 8);
  const bitIndex = 7 - ((pos - 1) % 8);
  return (data[byteIndex] >> bitIndex) & 1;
};

const setBit = (data: Uint8Array, pos: number, val: number) => {
  const byteIndex = Math.floor((pos - 1) / 8);
  const bitIndex = 7 - ((pos - 1) % 8);
  if (val) {
    data[byteIndex] |= (1 << bitIndex);
  } else {
    data[byteIndex] &= ~(1 << bitIndex);
  }
};

const permute = (input: Uint8Array, table: number[], outLenBytes: number): Uint8Array => {
  const output = new Uint8Array(outLenBytes);
  for (let i = 0; i < table.length; i++) {
    const val = getBit(input, table[i]);
    setBit(output, i + 1, val);
  }
  return output;
};

const xor = (a: Uint8Array, b: Uint8Array): Uint8Array => {
  const res = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) res[i] = a[i] ^ b[i];
  return res;
};

const rotateLeft = (bits28: number[], shift: number): number[] => {
  return [...bits28.slice(shift), ...bits28.slice(0, shift)];
};

// Key Schedule Generation
const generateSubkeys = (keyBytes: Uint8Array): Uint8Array[] => {
  // PC1
  const k56 = new Uint8Array(7);
  for(let i=0; i<56; i++) {
    const val = getBit(keyBytes, PC1[i]);
    setBit(k56, i+1, val);
  }

  // Split into C and D (28 bits each). Storing as bit arrays for easier shifting
  let C: number[] = [];
  let D: number[] = [];
  for(let i=0; i<28; i++) C.push(getBit(k56, i+1));
  for(let i=0; i<28; i++) D.push(getBit(k56, i+29));

  const subkeys: Uint8Array[] = [];

  for (let i = 0; i < 16; i++) {
    C = rotateLeft(C, SHIFTS[i]);
    D = rotateLeft(D, SHIFTS[i]);
    
    // Combine C and D
    const CD = [...C, ...D];
    
    // PC2
    const key48 = new Uint8Array(6);
    for(let j=0; j<48; j++) {
      // PC2 values are 1-indexed into the 56-bit CD
      const bitVal = CD[PC2[j] - 1]; 
      setBit(key48, j+1, bitVal);
    }
    subkeys.push(key48);
  }
  return subkeys;
};

// The Feistel function F
const feistelF = (right32: Uint8Array, subkey48: Uint8Array): Uint8Array => {
  // Expansion E (32 -> 48)
  const expanded = permute(right32, E, 6);
  
  // XOR with subkey
  const xored = xor(expanded, subkey48);
  
  // S-Boxes (48 -> 32)
  const output32 = new Uint8Array(4); // 32 bits
  // Iterate 8 groups of 6 bits
  // To avoid complex bit manipulation on byte boundaries, let's extract bits manually
  let bitStream: number[] = [];
  for(let i=1; i<=48; i++) bitStream.push(getBit(xored, i));

  let sBoxOutputBits: number[] = [];
  
  for(let i=0; i<8; i++) {
    const chunk = bitStream.slice(i*6, (i+1)*6);
    const row = (chunk[0] << 1) | chunk[5];
    const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
    const val = S_BOXES[i][row][col];
    
    // Push 4 bits of val
    sBoxOutputBits.push((val >> 3) & 1);
    sBoxOutputBits.push((val >> 2) & 1);
    sBoxOutputBits.push((val >> 1) & 1);
    sBoxOutputBits.push((val >> 0) & 1);
  }

  // Convert bits back to Uint8Array
  for(let i=0; i<32; i++) {
    setBit(output32, i+1, sBoxOutputBits[i]);
  }

  // P Permutation
  return permute(output32, P, 4);
};

// Single DES Block Encryption
export const desBlockEncrypt = (block64: Uint8Array, subkeys: Uint8Array[]): Uint8Array => {
  // Initial Permutation
  const ip = permute(block64, IP, 8);
  
  let L = ip.slice(0, 4);
  let R = ip.slice(4, 8);
  
  for (let i = 0; i < 16; i++) {
    const oldR = new Uint8Array(R);
    const fResult = feistelF(R, subkeys[i]);
    R = xor(L, fResult);
    L = oldR;
  }
  
  // 32-bit Swap (Final) -> R16 L16
  // Note: The loop effectively does the swap at the end of the last round if we just output R, L
  // Standard DES: Pre-output is R16, L16
  
  const preOutput = new Uint8Array(8);
  preOutput.set(R, 0); // R is first
  preOutput.set(L, 4); // L is second
  
  // Final Permutation (Inverse IP)
  return permute(preOutput, FP, 8);
};

export const desBlockDecrypt = (block64: Uint8Array, subkeys: Uint8Array[]): Uint8Array => {
  // Same as encrypt but subkeys in reverse
  const revKeys = [...subkeys].reverse();
  return desBlockEncrypt(block64, revKeys);
};

// Main Exported Functions
export const runDES = (mode: 'ECB' | 'CBC', key: Uint8Array, iv: Uint8Array, data: Uint8Array, decrypt: boolean): Uint8Array => {
  // Key Schedule
  const subkeys = generateSubkeys(key);
  
  // Padding (PKCS#5 / PKCS#7)
  let paddedData = data;
  if (!decrypt) {
    const padLen = 8 - (data.length % 8);
    const padArr = new Uint8Array(padLen).fill(padLen);
    const tmp = new Uint8Array(data.length + padLen);
    tmp.set(data);
    tmp.set(padArr, data.length);
    paddedData = tmp;
  }
  
  const blockCount = paddedData.length / 8;
  const output = new Uint8Array(paddedData.length);
  let previousBlock = iv.slice(0, 8); // CBC IV
  
  for (let i = 0; i < blockCount; i++) {
    const start = i * 8;
    let block = paddedData.slice(start, start + 8);
    
    if (!decrypt) {
      // Encrypt
      if (mode === 'CBC') {
        block = xor(block, previousBlock);
      }
      const processed = desBlockEncrypt(block, subkeys);
      output.set(processed, start);
      previousBlock = processed;
    } else {
      // Decrypt
      const ciphertextBlock = block; // Save for CBC next step
      let processed = desBlockDecrypt(block, subkeys);
      if (mode === 'CBC') {
        processed = xor(processed, previousBlock);
        previousBlock = ciphertextBlock;
      }
      output.set(processed, start);
    }
  }
  
  // Strip padding on decrypt
  if (decrypt) {
    const padLen = output[output.length - 1];
    // Basic validation
    if (padLen > 0 && padLen <= 8) {
        // Check integrity of padding
        let valid = true;
        for(let p=0; p<padLen; p++) {
             if(output[output.length - 1 - p] !== padLen) valid = false;
        }
        if(valid) return output.slice(0, output.length - padLen);
    }
    return output;
  }
  
  return output;
};

export const run3DES = (mode: 'ECB' | 'CBC', key: Uint8Array, iv: Uint8Array, data: Uint8Array, decrypt: boolean): Uint8Array => {
  // 3DES EDE (Encrypt-Decrypt-Encrypt)
  // Key must be 24 bytes (K1, K2, K3) or 16 bytes (K1, K2, K3=K1)
  let k1 = key.slice(0, 8);
  let k2 = key.slice(8, 16);
  let k3 = key.length >= 24 ? key.slice(16, 24) : k1;
  
  const sk1 = generateSubkeys(k1);
  const sk2 = generateSubkeys(k2);
  const sk3 = generateSubkeys(k3);
  
  // We process block by block using the EDE logic on the block level inside the CBC chain?
  // Actually, standard Triple DES CBC is:
  // C_i = E_k3(D_k2(E_k1(P_i XOR C_{i-1})))
  
  // Padding
  let paddedData = data;
  if (!decrypt) {
    const padLen = 8 - (data.length % 8);
    const padArr = new Uint8Array(padLen).fill(padLen);
    const tmp = new Uint8Array(data.length + padLen);
    tmp.set(data);
    tmp.set(padArr, data.length);
    paddedData = tmp;
  }
  
  const blockCount = paddedData.length / 8;
  const output = new Uint8Array(paddedData.length);
  let previousBlock = iv.slice(0, 8);
  
  for (let i = 0; i < blockCount; i++) {
    const start = i * 8;
    let block = paddedData.slice(start, start + 8);
    
    if (!decrypt) {
      // Encrypt
      if (mode === 'CBC') block = xor(block, previousBlock);
      
      // EDE
      const t1 = desBlockEncrypt(block, sk1);
      const t2 = desBlockDecrypt(t1, sk2);
      const t3 = desBlockEncrypt(t2, sk3);
      
      output.set(t3, start);
      previousBlock = t3;
    } else {
      // Decrypt
      // P_i = D_k1(E_k2(D_k3(C_i))) XOR C_{i-1}
      const cBlock = block;
      
      const t1 = desBlockDecrypt(block, sk3);
      const t2 = desBlockEncrypt(t1, sk2);
      const t3 = desBlockDecrypt(t2, sk1);
      
      let pBlock = t3;
      if (mode === 'CBC') {
        pBlock = xor(pBlock, previousBlock);
        previousBlock = cBlock;
      }
      output.set(pBlock, start);
    }
  }

  if (decrypt) {
     const padLen = output[output.length - 1];
     if (padLen > 0 && padLen <= 8) {
        let valid = true;
        for(let p=0; p<padLen; p++) {
            if(output[output.length - 1 - p] !== padLen) valid = false;
        }
        if (valid) return output.slice(0, output.length - padLen);
     }
     return output;
  }
  return output;
};


// ----------------------------------------------------------------------------
// Simplified Feistel for Visualization (Demo)
// ----------------------------------------------------------------------------
// 4 rounds, simple arithmetic F function, 8-byte block (using ASCII for easy viz if possible, but let's stick to bytes)

export interface FeistelStep {
    round: number;
    left: number[];
    right: number[];
    newRight: number[];
    subkey: number;
}

export const runFeistelDemo = (block8: number[], keyBytes: number[]): FeistelStep[] => {
    // Treat block as Left (4 bytes) and Right (4 bytes)
    // Convert bytes to single 32-bit integers for simpler "math" logic visualization
    // Actually keeping as byte arrays is more "block cipher" like.
    
    let L = block8.slice(0, 4);
    let R = block8.slice(4, 8);
    const steps: FeistelStep[] = [];
    
    // Simple 4 rounds
    for (let i = 0; i < 4; i++) {
        const subkey = keyBytes[i % keyBytes.length]; // Simple key schedule
        
        // F function: R + subkey (with some mixing)
        const fResult = R.map(b => (b + subkey + i*17) % 256);
        
        // XOR L with F(R)
        const newR = L.map((b, idx) => b ^ fResult[idx]);
        const oldR = [...R];
        
        steps.push({
            round: i + 1,
            left: L,
            right: R,
            newRight: newR, // This effectively becomes the R of next round (after swap logic)
            subkey: subkey
        });
        
        // Swap
        L = oldR;
        R = newR;
    }
    // No final swap for Feistel usually? Or yes? 
    // Usually Last swap is undone or ignored. 
    // We'll just show the steps.
    return steps;
};
