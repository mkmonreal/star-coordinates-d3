import { clone } from "./utils";
import { mean, standardDeviation } from "./operations";

const standarize = (value, mean, standardDeviation) =>
  (value - mean) / standardDeviation;

export const standarizeData = (data, columns) => {
  let result = clone(data);
  columns.forEach((column) => {
    const values = result.map((x) => parseFloat(x[column]));
    const meanValue = mean(values);
    const standardDeviationValue = standardDeviation(values, meanValue);

    result = result.map((x) => {
      x[column] = standarize(parseFloat(x[column]), meanValue, standardDeviationValue);
      return x;
    });
  });
  return result;
};
