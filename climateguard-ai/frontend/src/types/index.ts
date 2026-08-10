export interface Hotspot {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  temperatureAnomaly: number;
  rainfallAnomaly: number;
  humidity: number;
  droughtIndex: number;
  floodIndex: number;
  riskScore: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  drivers: string[];
  timestamp: string;
}

export interface HotspotStats {
  activeHotspots: number;
  criticalAlerts: number;
  averageRisk: number;
  highRiskRegions: number;
  latestUpdate: string;
}

export interface HistoricalData {
  date: string;
  riskScore: number;
  temperatureAnomaly: number;
  rainfallAnomaly: number;
  droughtIndex: number;
  floodIndex: number;
}

export interface AIAnalysis {
  summary: string;
  riskExplanation: string;
  drivers: string[];
  potentialImpacts: string[];
  earlyWarning: string;
  recommendations: string[];
  confidence: number;
}

export interface AIReport {
  title: string;
  location: string;
  timestamp: string;
  currentRisk: {
    score: number;
    category: string;
  };
  majorClimateDrivers: string[];
  observedIndicators: {
    temperatureAnomaly: number;
    rainfallAnomaly: number;
    humidity: number;
    droughtIndex: number;
    floodIndex: number;
  };
  aiAnalysis: AIAnalysis;
}
