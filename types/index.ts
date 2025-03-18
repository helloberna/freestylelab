// types/index.ts
export interface MediaStreamSource {
  disconnect: () => void;
}

export interface AnalyticsData {
  duration: number;
  wordsPerMinute: number;
  uniqueWords: number;
  totalWords: number;
  timestamp: Date;
}