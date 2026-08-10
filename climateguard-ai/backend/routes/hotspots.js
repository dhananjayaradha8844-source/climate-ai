const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { calculateRisk } = require('../services/riskEngine');

const hotspotsFilePath = path.join(__dirname, '../data/hotspots.json');

const getHotspotsData = () => {
  try {
    const data = fs.readFileSync(hotspotsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading hotspots data:", error);
    return [];
  }
};

// GET /api/hotspots
router.get('/', (req, res) => {
  const hotspots = getHotspotsData();
  res.json({ success: true, data: hotspots });
});

// GET /api/hotspots/summary/stats
router.get('/summary/stats', (req, res) => {
  const hotspots = getHotspotsData();
  let totalRisk = 0;
  let activeHotspots = hotspots.length;
  let highRiskRegions = 0;
  let criticalAlerts = 0;

  hotspots.forEach(h => {
    totalRisk += h.riskScore;
    if (h.riskScore >= 70) highRiskRegions++;
    if (h.riskCategory === 'Critical') criticalAlerts++;
  });

  res.json({
    success: true,
    data: {
      activeHotspots,
      criticalAlerts,
      averageRisk: activeHotspots > 0 ? Math.round(totalRisk / activeHotspots) : 0,
      highRiskRegions,
      latestUpdate: new Date().toISOString()
    }
  });
});

// GET /api/hotspots/summary/warnings
router.get('/summary/warnings', (req, res) => {
  const hotspots = getHotspotsData();
  const warnings = hotspots
    .filter(h => h.riskScore >= 50)
    .sort((a, b) => b.riskScore - a.riskScore);
  
  res.json({ success: true, data: warnings });
});

// GET /api/hotspots/:id
router.get('/:id', (req, res) => {
  const hotspots = getHotspotsData();
  const hotspot = hotspots.find(h => h.id === req.params.id);
  if (hotspot) {
    res.json({ success: true, data: hotspot });
  } else {
    res.status(404).json({ success: false, message: 'Hotspot not found' });
  }
});

// GET /api/hotspots/:id/historical
router.get('/:id/historical', (req, res) => {
  const hotspotId = req.params.id;
  // Generate realistic time-series demonstration data based on current date
  const history = [];
  const now = new Date();
  
  // Create 7 days of historical data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate trend (slightly increasing risk towards current)
    const trendMod = (6 - i) * 2; 
    
    history.push({
      date: date.toISOString().split('T')[0],
      riskScore: 50 + trendMod + Math.floor(Math.random() * 15),
      temperatureAnomaly: 1.5 + (trendMod / 10) + (Math.random() * 0.5),
      rainfallAnomaly: -20 - trendMod + (Math.random() * 10),
      droughtIndex: 40 + trendMod + (Math.random() * 10),
      floodIndex: 10 + (Math.random() * 5)
    });
  }

  res.json({ success: true, data: history });
});

// POST /api/hotspots/analyze
router.post('/analyze', (req, res) => {
  const data = req.body;
  const analysis = calculateRisk(data);
  
  res.json({
    success: true,
    data: {
      ...data,
      ...analysis
    }
  });
});

module.exports = router;
