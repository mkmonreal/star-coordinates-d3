import { extent } from "d3";
import { clone } from "./utils";

const normalize = (value, min, max) => (value - min) / (max - min);

export const normalizeData = (data, headers) => {
  let result = clone(data);
  headers.forEach((header) => {
    const values = result.map(x => parseFloat(x[header]));
    const ext = extent(values);
    console.log(header);
    console.log(ext);
    result = result.map((x) => {
      x[header] = normalize(x[header], ext[0], ext[1]);
      return x;
    });
  });
  return result;
};
