
// Birthday Paradox Calculation
export const calculateBirthdayProbability = (n: number): number => {
  if (n <= 1) return 0;
  if (n >= 366) return 100;
  
  let probabilityDoesNotExist = 1;
  for (let i = 0; i < n; i++) {
    probabilityDoesNotExist *= (365 - i) / 365;
  }
  return (1 - probabilityDoesNotExist) * 100;
};

// LFSR Logic (4-bit demo for visualization)
// Polynomial: x^4 + x^3 + 1 (Taps at 4 and 3, indices 0 and 1 in 0-based array from right?)
// Let's match the PDF example: 4-bit LFSR.
export interface LFSRState {
    bits: number[]; // [b3, b2, b1, b0]
    outputBit: number;
    feedbackBit: number;
    taps: number[]; // indices to XOR
}

export const stepLFSR = (currentBits: number[], taps: number[]): LFSRState => {
    // Taps are usually 1-based indices from the RIGHT (LSB).
    // If bits are [1, 0, 0, 1] (deg 4), index 0 is rightmost.
    
    const len = currentBits.length;
    let feedback = 0;
    
    taps.forEach(tapIndex => {
        // Tap index 0 corresponds to the last element (LSB)
        const arrIndex = len - 1 - tapIndex;
        if (arrIndex >= 0 && arrIndex < len) {
            feedback ^= currentBits[arrIndex];
        }
    });

    const outputBit = currentBits[len - 1];
    
    // Shift Right: Insert feedback at start (MSB), drop last
    const newBits = [feedback, ...currentBits.slice(0, len - 1)];
    
    return {
        bits: newBits,
        outputBit,
        feedbackBit: feedback,
        taps
    };
};

// RC4 Logic (Simplified for Viz)
export interface RC4State {
    S: number[];
    i: number;
    j: number;
    key: number[];
    output?: number;
    phase: 'KSA' | 'PRGA';
}

export const initRC4 = (keyStr: string, size: number = 16): RC4State => {
    const S = Array.from({ length: size }, (_, k) => k);
    const encoder = new TextEncoder();
    let key = Array.from(encoder.encode(keyStr));
    if (key.length === 0) key = [0];
    
    return {
        S,
        i: 0,
        j: 0,
        key,
        phase: 'KSA'
    };
};

export const stepRC4KSA = (state: RC4State): RC4State => {
    const { S, i, j, key } = state;
    const size = S.length;
    
    // j = (j + S[i] + key[i % key.length]) mod size
    const newJ = (j + S[i] + key[i % key.length]) % size;
    
    // Swap S[i] and S[j]
    const newS = [...S];
    [newS[i], newS[newJ]] = [newS[newJ], newS[i]];
    
    let nextI = i + 1;
    let phase = state.phase;
    
    if (nextI >= size) {
        nextI = 0; // Reset for PRGA
        phase = 'PRGA';
    }

    return {
        S: newS,
        i: nextI,
        j: phase === 'PRGA' ? 0 : newJ, // Usually j resets to 0 for PRGA
        key,
        phase
    };
};

export const stepRC4PRGA = (state: RC4State): RC4State => {
    let { S, i, j, key } = state;
    const size = S.length;

    i = (i + 1) % size;
    j = (j + S[i]) % size;

    const newS = [...S];
    [newS[i], newS[j]] = [newS[j], newS[i]];

    const t = (newS[i] + newS[j]) % size;
    const K = newS[t];

    return {
        S: newS,
        i,
        j,
        key,
        output: K,
        phase: 'PRGA'
    };
};
