import { clone } from "./utils";
import { mean, standardDeviation } from "./operations";

const standarize = (value, mean, standardDeviation) =>
  (value - mean) / standardDeviation;

export const standarizeData = (data, headers) => {
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
