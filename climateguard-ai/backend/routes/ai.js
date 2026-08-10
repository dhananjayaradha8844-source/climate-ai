const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { analyzeHotspot } = require('../services/aiService');

const hotspotsFilePath = path.join(__dirname, '../data/hotspots.json');

const getHotspotById = (id) => {
  try {
    const data = fs.readFileSync(hotspotsFilePath, 'utf8');
    const hotspots = JSON.parse(data);
    return hotspots.find(h => h.id === id);
  } catch (error) {
    return null;
  }
};

// POST /api/ai/analyze
router.post('/analyze', async (req, res) => {
  const { hotspotId, prompt } = req.body;
  
  const hotspot = getHotspotById(hotspotId);
  if (!hotspot) {
    return res.status(404).json({ success: false, message: 'Hotspot not found' });
  }

  try {
    const analysis = await analyzeHotspot(hotspot, prompt || "Explain the current climate risk");
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI analysis failed' });
  }
});

// POST /api/ai/report
router.post('/report', async (req, res) => {
  const { hotspotId } = req.body;
  
  const hotspot = getHotspotById(hotspotId);
  if (!hotspot) {
    return res.status(404).json({ success: false, message: 'Hotspot not found' });
  }

  try {
    const analysis = await analyzeHotspot(hotspot, "Generate a detailed climate risk assessment report.");
    
    // Assemble report structure
    const report = {
      title: "Climate Risk Assessment Report",
      location: hotspot.location,
      timestamp: new Date().toISOString(),
      currentRisk: {
        score: hotspot.riskScore,
        category: hotspot.riskCategory
      },
      majorClimateDrivers: hotspot.drivers,
      observedIndicators: {
        temperatureAnomaly: hotspot.temperatureAnomaly,
        rainfallAnomaly: hotspot.rainfallAnomaly,
        humidity: hotspot.humidity,
        droughtIndex: hotspot.droughtIndex,
        floodIndex: hotspot.floodIndex
      },
      aiAnalysis: analysis
    };

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Report generation failed' });
  }
});

module.exports = router;
