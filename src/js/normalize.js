import { extent } from "d3";
import { clone } from "./utils";

const normalize = (value, min, max) => (value - min) / (max - min);

export const normalizeData = (data, columns) => {
  let result = clone(data);
  columns.forEach((column) => {
    const values = result.map(x => parseFloat(x[column]));
    const ext = extent(values);
    console.log(column);
    console.log(ext);
    result = result.map((x) => {
      x[column] = normalize(x[column], ext[0], ext[1]);
      return x;
    });
  });
  return result;
};
