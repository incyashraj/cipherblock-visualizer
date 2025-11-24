
import { CryptoAlgorithm, CipherMode, KeyType, Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'guide',
    title: '0. Start Here: How to use this Lab',
    slideRef: 'User Guide',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Welcome to the Crypto Academy!</h3>
          <p>This is not just a textbook—it's an <strong>interactive laboratory</strong>. To get the most out of this tool, don't just read the text; play with the machine!</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="bg-slate-800 p-3 rounded border border-slate-700">
                <strong class="text-cipher-400 block mb-1">1. The Controls (Left)</strong>
                <p class="text-sm text-slate-300">This is your dashboard. Change the <strong>Algorithm</strong> (AES, DES), pick a <strong>Mode</strong>, and type your <strong>Secret Key</strong> here.</p>
            </div>
            <div class="bg-slate-800 p-3 rounded border border-slate-700">
                <strong class="text-blue-400 block mb-1">2. The Visualizer (Right)</strong>
                <p class="text-sm text-slate-300">Watch your text turn into data blocks. The <span class="text-cipher-400">Green Blocks</span> are the encrypted result. Hover over them to see details.</p>
            </div>
        </div>

        <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-white">
          <h4 class="font-bold text-white mb-1">How to follow the course:</h4>
          <ol class="list-decimal pl-5 space-y-2 text-slate-300">
            <li>Read the lesson card (this box).</li>
            <li>Follow the <strong>"Try it yourself"</strong> instructions in each lesson.</li>
            <li>Use the <strong>Next Module</strong> button below to move to the next topic.</li>
          </ol>
        </div>

        <p class="text-sm italic text-slate-400 mt-2">Ready? Type "Hello" in the Plaintext box below to see your first encryption, then click Next!</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.CBC,
      defaultPlaintext: "Hello World!",
      defaultKey: "MyFirstKey123",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'pillars',
    title: '1. Introduction: The 7 Pillars of Security',
    slideRef: 'Slides 5-8',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Foundations of Security</h3>
          <p>Before diving into ciphers, we must understand what we are protecting. Computer Security relies on 7 key concepts:</p>
        </div>

        <div class="grid grid-cols-1 gap-2 text-sm">
            <div class="bg-slate-800 p-2 rounded border-l-4 border-blue-500">
                <strong>1. Authentication:</strong> Verifying identity (e.g., 2FA, Passwords).
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-green-500">
                <strong>2. Authorization:</strong> Permissions (e.g., Access Control Lists).
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-red-500">
                <strong>3. Confidentiality:</strong> Secrecy. Solved by <strong class="text-white">Encryption</strong>.
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-yellow-500">
                <strong>4. Integrity:</strong> Data is unmodified. Solved by MACs / Hashes.
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-purple-500">
                <strong>5. Accountability:</strong> Who is responsible? Solved by logs/audit trails.
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-orange-500">
                <strong>6. Availability:</strong> Access when needed. Solved by redundancy.
            </div>
            <div class="bg-slate-800 p-2 rounded border-l-4 border-cyan-500">
                <strong>7. Non-Repudiation:</strong> Undeniability. Solved by Digital Signatures.
            </div>
        </div>
        <p class="text-sm italic text-slate-400">Cryptography primarily addresses Confidentiality, Integrity, Authentication, and Non-Repudiation.</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "Confidentiality is key.",
      defaultKey: "7Pillars",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'classical_1',
    title: '2. Classical I: Caesar & Substitution',
    slideRef: 'Slides 17-36',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">The Caesar Cipher</h3>
          <p>Used 2000 years ago! It simply shifts every letter by a fixed amount (e.g., 3). </p>
          <div class="bg-black/30 p-2 rounded font-mono text-center text-green-400 my-2 text-sm">
            L OLNH X  --> I LIKE U (Shift 3)
          </div>
        </div>

        <div class="bg-red-900/20 border border-red-800 p-3 rounded">
            <h4 class="font-bold text-red-400 text-sm">Weakness: Small Key Space</h4>
            <p class="text-xs text-slate-300">There are only <strong>25</strong> possible keys (shifts). A computer can crack this instantly.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Simple Substitution</h3>
          <p>What if we scramble the alphabet instead of just shifting? <br/> Key Space = $26! \\approx 2^{88}$. Secure?</p>
          <p class="text-red-400 font-bold mt-1">NO!</p>
          <p class="text-sm text-slate-300">It succumbs to <strong>Frequency Analysis</strong>. In English, 'E' appears 12% of the time, 'Z' only 0.7%. By counting letter frequencies in the ciphertext, we can map them back to the plaintext.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.Caesar,
      mode: CipherMode.ECB,
      defaultPlaintext: "L OLNH X",
      defaultKey: "3",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'classical_2',
    title: '3. Classical II: Vigenère Cipher',
    slideRef: 'Slides 38-47',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Poly-Alphabetic Substitution</h3>
          <p>The <strong>Vigenère Cipher</strong> (16th century) improved upon Caesar by using a <em>keyword</em> to shift letters by different amounts.</p>
        </div>

        <div class="bg-slate-800 p-3 rounded border-l-4 border-cipher-500 text-sm">
            <p><strong>Example:</strong> Msg: <span class="font-mono text-white">THEY...</span>, Key: <span class="font-mono text-yellow-400">DUH</span></p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
                <li>T + D (3) = W</li>
                <li>H + U (20) = B</li>
                <li>E + H (7) = L</li>
            </ul>
            <p class="mt-2">Result: <span class="font-mono text-green-400">WBL...</span></p>
        </div>

        <div>
            <h4 class="font-bold text-white text-sm">Breaking Vigenère</h4>
            <p class="text-xs text-slate-300">If the key is short, patterns repeat. In the example <code>THEYDRINKTHETEA</code> encrypted with <code>DUH</code>, the ciphertext segment <code>WBL</code> appears twice at an interval of 9. This suggests the key length is a factor of 9 (likely 3). Once key length is known, it breaks down into simple Caesar ciphers.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.Vigenere,
      mode: CipherMode.ECB,
      defaultPlaintext: "THEYDRINKTHETEA",
      defaultKey: "DUH",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'randomness',
    title: '4. Randomness & The Birthday Paradox',
    slideRef: 'Slides 4-7 & 60-66',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">What is Random?</h3>
          <p>Is the sequence <code class="text-yellow-400">11010110</code> more random than <code class="text-red-400">00000000</code>?</p>
          <p class="text-green-400 font-bold text-lg">NO.</p>
          <p class="text-sm text-slate-300">Both have the exact same probability ($1/256$). We think the first one is random because it <em>looks</em> patterned-less, but true randomness includes sequences that look ordered.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-cipher-500">
          <h4 class="font-bold text-cipher-400 mb-1">The Birthday Paradox</h4>
          <p class="text-slate-300 text-sm">How many people do you need in a room to have a >50% chance that two of them share a birthday? <strong>Only 23.</strong></p>
          <p class="text-xs text-slate-400 mt-1">This demonstrates that collisions in random sets happen much faster than our intuition suggests ($\approx \sqrt{N}$).</p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Try it yourself:</h3>
          <p class="text-slate-300">On the left, enter a <strong>Number of People</strong> (e.g. 23, 50, 70). The visualizer on the right will calculate the probability.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES, 
      mode: CipherMode.ECB,
      defaultPlaintext: "23",
      defaultKey: "",
      defaultKeyType: KeyType.NUMERIC,
      visualizer: 'birthday'
    }
  },
  {
    id: 'enigma',
    title: '5. Historical Ciphers: The Enigma',
    slideRef: 'Slides 8-29 (Week 1 & 2)',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">The Machine that Changed the War</h3>
          <p>During WW2, the Germans used the <strong>Enigma</strong> machine. It was polyalphabetic, meaning the substitution pattern changed with every key press.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 class="font-bold text-yellow-500 mb-1">How it Worked</h4>
          <ul class="list-disc pl-5 space-y-2 text-slate-300 text-sm">
            <li><strong>Rotors:</strong> Wheels that scrambled letters. They rotated after every key press.</li>
            <li><strong>Plugboard:</strong> Swapped pairs of letters (providing 103 sextillion possibilities!).</li>
            <li><strong>Reflector:</strong> Sent the signal back through the rotors, ensuring $A \\neq A$.</li>
          </ul>
        </div>

        <div>
            <h4 class="font-bold text-white mb-1">Breaking the Code</h4>
            <p class="text-sm text-slate-300">The Polish mathematician <strong>Marian Rejewski</strong> used group theory to deduce the wiring. Later, <strong>Alan Turing</strong> at Bletchley Park designed the <em>Bombe</em> to mechanize the breaking process, shortening the war by years.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "ENIGMA REVEALED",
      defaultKey: "BOMB",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard' 
    }
  },
  {
    id: 'stream_otp',
    title: '6. Stream Ciphers: The One-Time Pad',
    slideRef: 'Slides 48-58',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">The Perfect Cipher</h3>
          <p>The <strong>One-Time Pad (OTP)</strong> is the only mathematically unbreakable cipher (Perfect Secrecy). It uses a key as long as the message, completely random, and never reused.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-bold text-blue-400 mb-1">The Concept: XOR</h4>
          <p class="text-slate-300 text-sm">Encryption and Decryption are the same operation: <strong>XOR</strong> ($\oplus$).</p>
          <div class="grid grid-cols-2 gap-4 mt-2 font-mono text-xs">
             <div class="bg-black p-2 rounded">
                0 ⊕ 0 = 0<br/>
                0 ⊕ 1 = 1<br/>
                1 ⊕ 0 = 1<br/>
                1 ⊕ 1 = 0
             </div>
             <div class="bg-black p-2 rounded">
                YES (Plain)<br/>
                CAB (Pad)<br/>
                ---<br/>
                BFU (Cipher)
             </div>
          </div>
          <p class="text-xs mt-2 text-slate-400">Example: Y (25) + C (3) = B (28 mod 26 = 2).</p>
        </div>
        
        <div>
            <h4 class="font-bold text-white mb-1">Challenges</h4>
            <p class="text-sm text-slate-300">To use OTP, you need to securely distribute a key as long as the data you want to send. If you can do that, why not just send the data? This is the <strong>Key Distribution Problem</strong>.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.RC4, // Using RC4 as a stream cipher example
      mode: CipherMode.STREAM,
      defaultPlaintext: "YES",
      defaultKey: "CAB",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'rc4' 
    }
  },
  {
    id: 'lfsr',
    title: '7. Hardware Crypto: LFSR',
    slideRef: 'Slides 45-69 (Week 2)',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Linear Feedback Shift Registers</h3>
          <p>Stream ciphers are often used in hardware because they are cheap (few logic gates). The most common building block is the <strong>LFSR</strong>.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-300 text-sm">It is a simple shift register where the new bit entering the left side is calculated by XORing specific bits (taps) from the current state.</p>
            <div class="mt-2 font-mono text-xs text-green-400 bg-black p-2 rounded">
                NewBit = Bit[3] XOR Bit[0] <br/>
                Shift Right ->
            </div>
        </div>

        <div class="grid grid-cols-1 gap-2 text-sm text-slate-300">
            <p><strong>Maximal Period:</strong> If you pick the right taps (Primitive Polynomial), the sequence won't repeat for $2^n - 1$ steps.</p>
            <p class="text-red-400"><strong>Warning:</strong> LFSRs are <em>Linear</em>. They are extremely insecure on their own. An attacker can solve them using simple algebra.</p>
        </div>

        <p class="text-sm italic text-slate-400">The Visualizer on the right shows a 4-bit LFSR. Click "Step" to watch the bits shift.</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.LFSR,
      mode: CipherMode.STREAM,
      defaultPlaintext: "",
      defaultKey: "",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'lfsr'
    }
  },
  {
    id: 'rc4',
    title: '8. Software Crypto: RC4',
    slideRef: 'Slides 87-92 (Week 2)',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">The Speed Demon</h3>
          <p>Designed by Ron Rivest in 1987, <strong>RC4</strong> is a stream cipher optimized for software. It doesn't use complex math, just byte swapping.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 class="font-bold text-yellow-500 mb-1">How it Works</h4>
          <ol class="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
            <li><strong>KSA (Key Scheduling):</strong> Initialize an array $S$ of 0..255. Scramble it using the Key.</li>
            <li><strong>PRGA (Generation):</strong> Continually swap elements in $S$ and output a byte to use as the keystream.</li>
          </ol>
        </div>

        <div>
            <h4 class="font-bold text-white mb-1">Legacy</h4>
            <p class="text-sm text-slate-300">RC4 was used everywhere (WEP Wifi, SSL/TLS). However, biases were found in its output (it wasn't random enough at the start). It is now considered broken and should not be used.</p>
        </div>
        
        <p class="text-sm italic text-slate-400">The Visualizer shows a mini-RC4 (16 bytes) shuffling its state.</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.RC4,
      mode: CipherMode.STREAM,
      defaultPlaintext: "",
      defaultKey: "Key",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'rc4'
    }
  },
  {
    id: 'modern_stream',
    title: '9. Modern Stream Ciphers',
    slideRef: 'Slides 75-86 (Week 2)',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Non-Linearity is Key</h3>
          <p>Since LFSRs are linear (weak), modern stream ciphers combine them with non-linear functions to be secure.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-800 p-3 rounded border border-slate-700">
                <strong class="text-green-400 block mb-1">A5/1 (GSM)</strong>
                <p class="text-xs text-slate-300">Used in 2G phones. Used 3 LFSRs with a "majority vote" clocking rule to add non-linearity. It was reverse-engineered and broken.</p>
            </div>
            <div class="bg-slate-800 p-3 rounded border border-slate-700">
                <strong class="text-blue-400 block mb-1">Grain-128a</strong>
                <p class="text-xs text-slate-300">Combines an LFSR with an NFSR (Non-Linear FSR). Secure and efficient for hardware (RFID tags).</p>
            </div>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg">
          <h4 class="font-bold text-white mb-1">The eSTREAM Project</h4>
          <p class="text-slate-300 text-sm">A European project to find new, secure stream ciphers. Finalists included <strong>Salsa20</strong> (software) and <strong>Grain</strong> (hardware).</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES, // Fallback
      mode: CipherMode.STREAM,
      defaultPlaintext: "Modern Crypto",
      defaultKey: "Grain128",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'basics',
    title: '10. Block Ciphers: The Basics',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">What is a Block Cipher?</h3>
          <p>Imagine you have a secret letter. A <strong>Block Cipher</strong> is like a machine that cuts your letter into equal-sized pieces (called <strong>Blocks</strong>) and puts each piece into a locked box.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-cipher-500">
          <h4 class="font-bold text-cipher-400 mb-1">Key Concepts:</h4>
          <ul class="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>Plaintext (P):</strong> Your original message (e.g., "Hello World").</li>
            <li><strong>Key (K):</strong> The secret password. You need the same key to lock (encrypt) and unlock (decrypt) the data.</li>
            <li><strong>Block Size:</strong> The machine can only handle small chunks at a time (usually 8 or 16 bytes).</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Try it yourself:</h3>
          <p class="text-slate-300">Look at the <strong>Plaintext Blocks</strong> section on the right. Type a long message below. See how the computer chops it into separate squares? Those are the blocks.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "Block Ciphers chop data into fixed chunks.",
      defaultKey: "SecretKey123",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'confusion',
    title: '11. The Secret Key (Confusion)',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Why do we need a Key?</h3>
          <p>If the encryption method is public (everyone knows how AES works), what keeps your data safe? The <strong>Key</strong>.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
          <h4 class="font-bold text-yellow-500 mb-1">The Principle of Confusion</h4>
          <p class="text-slate-300">The relationship between the Key and the encrypted result (Ciphertext) should be incredibly complex. If you change just <strong>one letter</strong> of your password, the entire locked message should look completely different.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Experiment:</h3>
          <p class="text-slate-300">We have switched the visualizer to <strong>Avalanche Mode</strong>. It will automatically test two scenarios side-by-side.</p>
          <p class="text-slate-300">Try changing the key. Notice how even with the same text, the result is chaos.</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "The key is the secret.",
      defaultKey: "Secret",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'avalanche'
    }
  },
  {
    id: 'diffusion',
    title: '12. The Avalanche Effect (Diffusion)',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">The "Snowball" Effect</h3>
          <p>A good encryption system spreads information out. This is called <strong>Diffusion</strong>. If you change a tiny part of your message (like changing "Cat" to "Bat"), the encrypted result shouldn't just change slightly—it should change completely.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-bold text-blue-400 mb-1">Visualizing Diffusion</h4>
          <p class="text-slate-300">Ideally, flipping <strong>1 bit</strong> in the input should flip about <strong>50%</strong> of the bits in the output. This prevents attackers from guessing the message by looking for patterns.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Interactive Demo:</h3>
          <p class="text-slate-300">The <strong>Avalanche Visualizer</strong> on the right is now active. It takes your input, flips 1 bit (invisible to you, but math-real), and compares the output.</p>
          <p class="text-green-400 font-bold">Look for a high Diffusion Score (~50%). The red boxes show all the bytes that changed!</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "Attack at Dawn",
      defaultKey: "AvalancheKey",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'avalanche'
    }
  },
  {
    id: 'feistel',
    title: '13. How it Works: Feistel Network',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Inside the Machine</h3>
          <p>How does the computer actually scramble the bits? Many older ciphers (like DES) use a structure called a <strong>Feistel Network</strong>.</p>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg">
          <p class="text-slate-300 mb-2">It works like shuffling a deck of cards repeatedly:</p>
          <ol class="list-decimal pl-5 space-y-2 text-slate-300">
            <li>Split the data block into <strong>Left</strong> and <strong>Right</strong> halves.</li>
            <li>Take the Right half, mix it with a Sub-Key, and scramble it.</li>
            <li>Combine this scrambled mess with the Left half.</li>
            <li><strong>Swap</strong> the sides.</li>
            <li>Repeat for many rounds (DES does this 16 times!).</li>
          </ol>
        </div>

        <p class="text-sm italic text-cipher-400">The Visualizer is now showing the <strong>Internal View</strong>. Click "Next Step" to walk through the rounds.</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.Feistel,
      mode: CipherMode.ECB,
      defaultPlaintext: "FEISTEL!",
      defaultKey: "Key",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'feistel'
    }
  },
  {
    id: 'modes',
    title: '14. Modes: ECB vs CBC',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">Hiding Patterns</h3>
          <p>If you encrypt the same block twice with the same key, you get the same result. This is a problem!</p>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="bg-red-900/20 border border-red-800 p-3 rounded">
            <h4 class="font-bold text-red-400">ECB Mode (Bad)</h4>
            <p class="text-sm text-slate-300">Electronic Codebook. Each block is independent. If your message is "HAHAHA", the encryption will look like "XYXYXY". Patterns remain visible.</p>
          </div>
          <div class="bg-green-900/20 border border-green-800 p-3 rounded">
            <h4 class="font-bold text-green-400">CBC Mode (Good)</h4>
            <p class="text-sm text-slate-300">Cipher Block Chaining. Each block is mixed with the previous one before encrypting. Even "HAHAHA" will look like random noise.</p>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-white mb-2">Task:</h3>
          <p class="text-slate-300">1. Select <strong>AES</strong> and <strong>ECB</strong> mode.</p>
          <p class="text-slate-300">2. Type "AAAAAAAAAAAAAAA". Notice the blocks are identical.</p>
          <p class="text-slate-300">3. Switch to <strong>CBC</strong> mode. Notice the blocks are now all different!</p>
        </div>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "AAAAAAAAAAAAAAA",
      defaultKey: "PatternKey",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'standard'
    }
  },
  {
    id: 'aes_math',
    title: '15. Deep Dive: The Math of AES',
    slideRef: 'Previous Content',
    content: `
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-white mb-2">How AES Actually Works</h3>
          <p>AES doesn't use Feistel. Instead, it uses a <strong>Substitution-Permutation Network</strong>. Each round has 4 layers:</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="bg-purple-900/30 p-3 rounded border border-purple-500/30">
                <strong class="text-purple-400 text-sm">1. ByteSub (Substitution)</strong>
                <p class="text-xs text-slate-300 mt-1">Replaces every byte using a mathematical table (S-Box). This provides <em class="text-white">Non-Linearity</em>.</p>
            </div>
            <div class="bg-blue-900/30 p-3 rounded border border-blue-500/30">
                <strong class="text-blue-400 text-sm">2. ShiftRows (Permutation)</strong>
                <p class="text-xs text-slate-300 mt-1">Shifts rows of the data block to spread bytes around.</p>
            </div>
            <div class="bg-green-900/30 p-3 rounded border border-green-500/30">
                <strong class="text-green-400 text-sm">3. MixColumns (Linear)</strong>
                <p class="text-xs text-slate-300 mt-1">Mixes each column using Matrix Multiplication in GF(2^8). This provides <em class="text-white">Diffusion</em>.</p>
            </div>
            <div class="bg-yellow-900/30 p-3 rounded border border-yellow-500/30">
                <strong class="text-yellow-400 text-sm">4. AddRoundKey</strong>
                <p class="text-xs text-slate-300 mt-1">XORs the data with the Key. This is where the secret comes in.</p>
            </div>
        </div>

        <div class="bg-slate-800 p-4 rounded-lg border-l-4 border-purple-500">
          <h4 class="font-bold text-purple-400 mb-1">The S-Box & Galois Fields</h4>
          <p class="text-slate-300 text-sm">The S-Box isn't random. It is calculated using <strong>Modular Inverse</strong> in a Finite Field GF(2^8) followed by an Affine Transformation. This makes AES mathematically incredibly strong.</p>
        </div>

        <p class="text-sm italic text-slate-400">The Visualizer is now showing the <strong>AES S-Box Table</strong>. Move your mouse over the grid to see the math in action.</p>
      </div>
    `,
    config: {
      algorithm: CryptoAlgorithm.AES,
      mode: CipherMode.ECB,
      defaultPlaintext: "Math is beautiful.",
      defaultKey: "GaloisFieldKey",
      defaultKeyType: KeyType.PASSPHRASE,
      visualizer: 'sbox'
    }
  }
];
