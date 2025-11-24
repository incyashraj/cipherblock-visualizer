
export const cryptoFacts = [
    "The 's' in HTTPS stands for Secure. It uses TLS (Transport Layer Security) which relies on both asymmetric (RSA/ECC) and symmetric (AES) encryption.",
    "During WWII, the Navajo language was used as an unwritten code (Navajo Code Talkers) which the Japanese forces were never able to decipher.",
    "A standard 256-bit AES key has 1.1 x 10^77 combinations. That is more than the number of atoms in the observable universe.",
    "The first known evidence of cryptography is the 'Khnumhotep II' hieroglyphs found in Egypt, dating back to approximately 1900 BC.",
    "Quantum Computers threaten current encryption (RSA) because they can factor large numbers incredibly fast using Shor's Algorithm.",
    "The 'Padlock' icon in your browser doesn't mean the website is safe; it only means the connection between you and the site is encrypted.",
    "One-Time Pads are the only mathematically unbreakable ciphers, but they require a key as long as the message that is never reused.",
    "Hashing is one-way cryptography. You can turn a password into a hash, but you cannot turn a hash back into a password (mathematically).",
    "In 2010, the 'Stuxnet' worm used stolen digital certificates to sabotage Iran's nuclear centrifuges, marking the first known cyber-physical weapon.",
    "The Enigma Machine had 158 quintillion possible settings. Alan Turing and his team built the 'Bombe' to search through them mechanically.",
    "Modern passwords should be 'salted' before hashing. A salt is random data added to the password to protect against Rainbow Table attacks.",
    "Diffie-Hellman Key Exchange allows two parties to create a shared secret over an insecure channel without ever sending the secret itself.",
    "The Zimmerman Telegram (1917) was a deeply encrypted German message decoded by the British, which helped draw the US into WWI.",
    "Blockchain technology relies on cryptographic hashing (SHA-256) to link blocks together, making the history immutable.",
    "Kerckhoffs's Principle states that a cryptosystem should be secure even if everything about the system, except the key, is public knowledge."
];

export const getRandomFact = () => {
    const idx = Math.floor(Math.random() * cryptoFacts.length);
    return cryptoFacts[idx];
};
