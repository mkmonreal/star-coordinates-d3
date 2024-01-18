import { csv, dsvFormat } from "d3";

export const parseCsv = (text) => {
    return dsvFormat(",").parse(text);
};
