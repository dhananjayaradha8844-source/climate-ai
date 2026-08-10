/**
 * Climate Risk Engine
 * Calculates a risk score based on weighted factors and categorizes the severity.
 */

const calculateRisk = (data) => {
  const {
    temperatureAnomaly = 0, // Assume normal range is 0 to 5 for anomaly
    rainfallAnomaly = 0, // Can be negative (drought) or positive (flood)
    humidity = 50,
    droughtIndex = 0, // 0 to 100
    floodIndex = 0 // 0 to 100
  } = data;

  // Normalize factors (0 to 100 scale)
  // Temp Anomaly: max typical is around 5. Let's cap at 5 for 100%.
  let tempScore = (Math.abs(temperatureAnomaly) / 5) * 100;
  if (tempScore > 100) tempScore = 100;

  // Rainfall Anomaly: can be extreme in both directions
  let rainScore = (Math.abs(rainfallAnomaly) / 200) * 100;
  if (rainScore > 100) rainScore = 100;

  // Humidity: distance from comfortable 50%
  let humidityScore = (Math.abs(humidity - 50) / 50) * 100;

  // Calculate weighted score
  /*
    Temperature Risk       25%
    Rainfall Risk          20%
    Drought Risk           20%
    Flood Risk             25%
    Humidity               10%
  */
  const score = (
    (tempScore * 0.25) +
    (rainScore * 0.20) +
    (droughtIndex * 0.20) +
    (floodIndex * 0.25) +
    (humidityScore * 0.10)
  );

  const riskScore = Math.round(score);

  // Determine Category
  let riskCategory = 'Low';
  if (riskScore >= 30 && riskScore < 50) riskCategory = 'Moderate';
  else if (riskScore >= 50 && riskScore < 70) riskCategory = 'High';
  else if (riskScore >= 70 && riskScore < 85) riskCategory = 'Very High';
  else if (riskScore >= 85) riskCategory = 'Critical';

  // Determine Drivers
  const drivers = [];
  if (temperatureAnomaly >= 2.5) drivers.push("Extreme Heat");
  else if (temperatureAnomaly <= -2.5) drivers.push("Extreme Cold");
  
  if (droughtIndex >= 70) drivers.push("Severe Drought");
  else if (droughtIndex >= 40) drivers.push("Moderate Drought");

  if (floodIndex >= 70) drivers.push("Severe Flood Risk");
  else if (floodIndex >= 40) drivers.push("Moderate Flood Risk");

  if (rainfallAnomaly >= 100) drivers.push("Extreme Rainfall");
  else if (rainfallAnomaly <= -100) drivers.push("Severe Rainfall Deficit");

  return {
    riskScore,
    riskCategory,
    hotspot: riskScore >= 50,
    drivers
  };
};

module.exports = { calculateRisk };
