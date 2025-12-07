/**
 * Calculate fighter health status based on telemetry data
 * Priority: Emergency > Need Attention > Normal
 */

const calculateStatus = (telemetryData, lastAccelTime) => {
  const { hr, sp, tp, m2, m7 } = telemetryData;
  const now = new Date();

  // 🔴 Emergency conditions
  if (hr < 50) {
    return 'emergency';
  }
  if (sp < 90) {
    return 'emergency';
  }
  // Check accelerometer inactivity (30 seconds)
  if (lastAccelTime) {
    const inactivitySeconds = (now - new Date(lastAccelTime)) / 1000;
    if (inactivitySeconds > 30) {
      return 'emergency';
    }
  }

  // 🟠 Need Attention conditions
  if (m7 > 200) { // CO > 200 ppm
    return 'need_attention';
  }
  if (m2 > 50000) { // Methane > 50,000 ppm
    return 'need_attention';
  }
  if (tp > 105) { // Temperature > 105°C
    return 'need_attention';
  }

  // 🟢 Normal - all values within safe range
  return 'normal';
};

module.exports = { calculateStatus };

