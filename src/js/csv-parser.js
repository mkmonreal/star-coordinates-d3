import { dsvFormat } from 'd3';

const parseCsv = (text) => dsvFormat(',').parse(text);

export default parseCsv;
