import React from 'react';

export enum CipherMode {
  CBC = 'CBC',
  ECB = 'ECB',
  // AES specific
  GCM = 'GCM',
  CTR = 'CTR',
  // Stream Cipher specific
  STREAM = 'STREAM', 
}

export enum CryptoAlgorithm {
  AES = 'AES',
  DES = 'DES',
  TripleDES = '3DES',
  Feistel = 'Feistel (Demo)', // For educational step-by-step
  // New additions
  RC4 = 'RC4',
  LFSR = 'LFSR',
  Caesar = 'Caesar (Classical)',
  Vigenere = 'Vigenère (Classical)',
  Enigma = 'Enigma (History)',
}

export enum KeyType {
  PASSPHRASE = 'Passphrase',
  HEX = 'Hex',
  NUMERIC = 'Numeric', // For birthday paradox
}

export interface CryptoState {
  plaintext: string;
  keyPhrase: string;
  ivHex: string; 
  ciphertextHex: string;
  decryptedText: string;
  mode: CipherMode;
  algorithm: CryptoAlgorithm;
  isValidKey: boolean;
  error: string | null;
}

export interface BlockData {
  index: number;
  hex: string[];
  ascii: string[];
  isPadding?: boolean;
}

export interface RoundStep {
  roundNumber: number;
  left: number[];
  right: number[];
  subkey: number[];
  description: string;
}

export type VisualizerType = 'standard' | 'feistel' | 'avalanche' | 'sbox' | 'birthday' | 'lfsr' | 'rc4';

export interface LessonConfig {
  algorithm: CryptoAlgorithm;
  mode: CipherMode;
  defaultPlaintext: string;
  defaultKey: string;
  defaultKeyType: KeyType;
  visualizer: VisualizerType;
}

export interface Lesson {
  id: string;
  title: string;
  slideRef?: string; // e.g. "Slide 19"
  content: React.ReactNode;
  config: LessonConfig;
}