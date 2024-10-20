export const assessKoiGrowth = (growthData, koiAge) => {
    if (growthData.length < 2) {
      return "Insufficient data for assessment";
    }
  
    // Sort data by date
    const sortedData = growthData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // Calculate growth rates
    const growthRates = [];
    for (let i = 1; i < sortedData.length; i++) {
      const timeDiff = (new Date(sortedData[i].date) - new Date(sortedData[i-1].date)) / (1000 * 60 * 60 * 24 * 30); // Months
      const lengthGrowth = (sortedData[i].length - sortedData[i-1].length) / timeDiff;
      const weightGrowth = (sortedData[i].weight - sortedData[i-1].weight) / timeDiff;
      growthRates.push({ lengthGrowth, weightGrowth });
    }
  
    // Calculate average growth rates
    const avgLengthGrowth = growthRates.reduce((sum, rate) => sum + rate.lengthGrowth, 0) / growthRates.length;
    const avgWeightGrowth = growthRates.reduce((sum, rate) => sum + rate.weightGrowth, 0) / growthRates.length;
  
    // Check recent growth (last 3 months or less if not enough data)
    const recentGrowth = growthRates.slice(-Math.min(3, growthRates.length));
    const recentAvgLengthGrowth = recentGrowth.reduce((sum, rate) => sum + rate.lengthGrowth, 0) / recentGrowth.length;
    const recentAvgWeightGrowth = recentGrowth.reduce((sum, rate) => sum + rate.weightGrowth, 0) / recentGrowth.length;
  
    // Define expected growth rates based on age (this would need to be adjusted based on koi breed standards)
    const expectedGrowthRate = koiAge < 24 ? 2 : koiAge < 60 ? 1 : 0.5; // cm per month
  
    let assessment = "";
  
    if (Math.abs(recentAvgLengthGrowth - avgLengthGrowth) / avgLengthGrowth > 0.3) {
      if (recentAvgLengthGrowth > avgLengthGrowth) {
        assessment += "Recent growth has increased significantly. ";
      } else {
        assessment += "Recent growth has decreased significantly. ";
      }
    } else if (Math.abs(recentAvgLengthGrowth - expectedGrowthRate) / expectedGrowthRate > 0.2) {
      if (recentAvgLengthGrowth > expectedGrowthRate) {
        assessment += "Growth is above expected rate. ";
      } else {
        assessment += "Growth is below expected rate. ";
      }
    } else {
      assessment += "Growth is normal. ";
    }
  
    if (recentAvgWeightGrowth / recentAvgLengthGrowth > 1.5 * (avgWeightGrowth / avgLengthGrowth)) {
      assessment += "Weight gain is outpacing length growth, which might indicate overfeeding.";
    }
  
    return assessment;
  };