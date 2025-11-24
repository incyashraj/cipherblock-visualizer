
import { CryptoAlgorithm } from '../types';

const STORAGE_KEY = 'cipherblock_analytics_v1';

export interface AppStats {
  totalVisits: number;
  algoUsage: Record<string, number>;
  firstVisit: number;
  lastVisit: number;
}

const getStats = (): AppStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    totalVisits: 0,
    algoUsage: {},
    firstVisit: Date.now(),
    lastVisit: Date.now(),
  };
};

const saveStats = (stats: AppStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const trackVisit = () => {
  const stats = getStats();
  // Simple check to prevent incrementing on every refresh within same session (1 hour)
  const now = Date.now();
  if (now - stats.lastVisit > 3600000 || stats.totalVisits === 0) {
      stats.totalVisits += 1;
  }
  stats.lastVisit = now;
  saveStats(stats);
};

export const trackAlgoUsage = (algo: CryptoAlgorithm) => {
  const stats = getStats();
  if (!stats.algoUsage[algo]) {
    stats.algoUsage[algo] = 0;
  }
  stats.algoUsage[algo] += 1;
  saveStats(stats);
};

export const getAnalyticsData = (): AppStats => {
    return getStats();
};
