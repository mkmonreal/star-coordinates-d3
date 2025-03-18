import { extent } from 'd3';
import clone from '../utils';

const normalize = (value, min, max) => (value - min) / (max - min);

const normalizeData = (data, headers, exclude) => {
	let result = clone(data);
	headers.forEach((header) => {
		const values = result.map((x) => parseFloat(x[header]));
		const ext = extent(values);
		result = result.map((x) => {
			// if (exclude && exclude.includes(header)) {
			// 	return x;
			// }
			const newX = x;
			newX[header] = normalize(newX[header], ext[0], ext[1]);
			return newX;
		});
	});
	return result;
};

export default normalizeData;
