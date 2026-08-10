require('dotenv').config();
const express = require('express');
const cors = require('cors');

const hotspotRoutes = require('./routes/hotspots');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'ClimateGuard AI API',
    status: 'healthy'
  });
});

// Routes
app.use('/api/hotspots', hotspotRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
