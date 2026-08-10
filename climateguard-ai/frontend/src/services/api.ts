import axios from 'axios';
import type { Hotspot, HotspotStats, HistoricalData, AIReport, AIAnalysis } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHotspots = async (): Promise<Hotspot[]> => {
  const response = await api.get('/hotspots');
  return response.data.data;
};

export const getHotspot = async (id: string): Promise<Hotspot> => {
  const response = await api.get(`/hotspots/${id}`);
  return response.data.data;
};

export const getStats = async (): Promise<HotspotStats> => {
  const response = await api.get('/hotspots/summary/stats');
  return response.data.data;
};

export const getWarnings = async (): Promise<Hotspot[]> => {
  const response = await api.get('/hotspots/summary/warnings');
  return response.data.data;
};

export const getHistorical = async (id: string): Promise<HistoricalData[]> => {
  const response = await api.get(`/hotspots/${id}/historical`);
  return response.data.data;
};

export const analyzeHotspot = async (hotspotId: string, prompt?: string): Promise<AIAnalysis> => {
  const response = await api.post('/ai/analyze', { hotspotId, prompt });
  return response.data.data;
};

export const generateReport = async (hotspotId: string): Promise<AIReport> => {
  const response = await api.post('/ai/report', { hotspotId });
  return response.data.data;
};
