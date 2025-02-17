import clone from '../utils';

const sumarize = (data) => data.reduce((x, y) => x + y);

const mean = (data) => sumarize(data) / data.length;

const variance = (data, meanValue) => {
  const sum = data.reduce((x, y) => x + (y - meanValue) ** 2);
  return sum / data.length;
};

const standardDeviation = (data, meanValue) => Math.sqrt(variance(data, meanValue));

function standarize(value, meanValue, standardDeviationValue) {
  return (value - meanValue) / standardDeviationValue;
}

const standarizeData = (data, headers) => {
  let result = clone(data);
  headers.forEach((header) => {
    const values = result.map((x) => parseFloat(x[header]));
    const meanValue = mean(values);
    const standardDeviationValue = standardDeviation(values, meanValue);

    result = result.map((x) => {
      const newX = x;
      newX[header] = standarize(parseFloat(newX[header]), meanValue, standardDeviationValue);
      return newX;
    });
  });
  return result;
};

export default standarizeData;
