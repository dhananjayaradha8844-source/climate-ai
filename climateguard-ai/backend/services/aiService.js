const axios = require('axios');

/**
 * AI Service for Climate Analysis
 * Includes a deterministic fallback if AI_API_KEY is not set.
 */

const generateFallbackExplanation = (data) => {
  const {
    location,
    temperatureAnomaly = 0,
    rainfallAnomaly = 0,
    droughtIndex = 0,
    floodIndex = 0,
    riskScore,
    riskCategory
  } = data;

  const drivers = [];
  const impacts = [];
  let summary = `The location ${location || 'selected'} is currently showing a ${riskCategory} risk level. `;

  if (temperatureAnomaly > 3) {
    drivers.push("Extreme heat is a major risk driver.");
    impacts.push("High risk of heat stress for vulnerable populations.");
    impacts.push("Potential infrastructure damage due to extreme temperatures.");
  } else if (temperatureAnomaly < -3) {
    drivers.push("Abnormal cold temperatures are driving risk.");
    impacts.push("Risk of crop damage and energy grid strain.");
  }

  if (droughtIndex > 70) {
    drivers.push("Severe drought conditions are contributing significantly to the risk.");
    impacts.push("Severe water shortages affecting agriculture and local water supply.");
  } else if (droughtIndex > 40) {
    drivers.push("Moderate drought is developing.");
    impacts.push("Early signs of water stress in vegetation.");
  }

  if (floodIndex > 70) {
    drivers.push("High flood potential is a significant hazard.");
    impacts.push("Immediate risk of flash flooding and property damage.");
  } else if (floodIndex > 40) {
    drivers.push("Elevated flood index indicates potential danger.");
    impacts.push("Risk of localized flooding in low-lying areas.");
  }

  if (rainfallAnomaly > 100) {
    drivers.push("Excessive rainfall anomaly recorded.");
    impacts.push("Over-saturation of soil leading to landslide risks.");
  } else if (rainfallAnomaly < -50) {
    drivers.push("Significant rainfall deficit recorded.");
  }

  if (drivers.length === 0) {
    drivers.push("Climate indicators are showing some deviations from the norm.");
    impacts.push("Monitor for developing patterns.");
  }

  let warning = "";
  if (riskCategory === "Critical" || riskCategory === "Very High") {
    warning = "Immediate action is required. Local authorities should prepare emergency response protocols.";
  } else if (riskCategory === "High") {
    warning = "Preparations should be made. Monitor the situation closely over the next 48 hours.";
  } else {
    warning = "No immediate severe threat, but conditions warrant standard monitoring.";
  }

  return {
    summary: summary + drivers.join(' '),
    riskExplanation: `The computed risk score of ${riskScore} reflects a combination of current environmental anomalies.`,
    drivers: drivers,
    potentialImpacts: impacts,
    earlyWarning: warning,
    recommendations: [
      "Continuously monitor local weather updates.",
      "Review and update emergency preparedness plans.",
      "Ensure communication channels with local emergency services are open."
    ],
    confidence: 0.85
  };
};

const analyzeHotspot = async (data, prompt) => {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL || 'gpt-4';

  if (!apiKey) {
    console.log("No AI_API_KEY found, using deterministic fallback.");
    return generateFallbackExplanation(data);
  }

  try {
    // If there is an API key, we make a real request.
    // Example implementation using standard OpenAI format
    const response = await axios.post(baseUrl || 'https://api.openai.com/v1/chat/completions', {
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a professional climate data analyst. Return the response strictly as a JSON object matching the required schema: summary, riskExplanation, drivers, potentialImpacts, earlyWarning, recommendations, confidence (0-1)."
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\n\nClimate Data: ${JSON.stringify(data)}\nProvide analysis strictly in JSON.`
        }
      ],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    return {
      summary: result.summary || "",
      riskExplanation: result.riskExplanation || "",
      drivers: result.drivers || [],
      potentialImpacts: result.potentialImpacts || [],
      earlyWarning: result.earlyWarning || "",
      recommendations: result.recommendations || [],
      confidence: result.confidence || 0.9
    };
  } catch (error) {
    console.error("AI API failed, falling back to deterministic generation:", error.message);
    return generateFallbackExplanation(data);
  }
};

module.exports = { analyzeHotspot };
