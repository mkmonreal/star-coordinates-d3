import { clone } from "../utils";

const sumarize = (data) => data.reduce((x, y) => x + y);

const mean = (data) => sumarize(data) / data.length;

const variance = (data, mean) => {
  const sum = data.reduce((x, y) => x + Math.pow(y - mean, 2));
  return sum / data.length;
}

const standardDeviation = (data, mean) => Math.sqrt(variance(data, mean));

const standarize = (value, mean, standardDeviation) =>
  (value - mean) / standardDeviation;

const standarizeData = (data, headers) => {
  let result = clone(data);
  headers.forEach((header) => {
    const values = result.map((x) => parseFloat(x[header]));
    const meanValue = mean(values);
    const standardDeviationValue = standardDeviation(values, meanValue);

    result = result.map((x) => {
      x[header] = standarize(parseFloat(x[header]), meanValue, standardDeviationValue);
      return x;
    });
  });
  return result;
};

export default standarizeData;
