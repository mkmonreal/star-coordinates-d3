import { mean, std, Matrix } from 'mathjs';

function standarize(value, meanValue, standardDeviationValue) {
	return (value - meanValue) / standardDeviationValue;
}

const standarizeData = (data) => {
	if (typeof Matrix !== typeof data) {
		console.error('Data is not a matrix');
		return;
	}

	let result = data.clone();
	const [rows, cols] = result.size();
	for (const colNumber of cols) {
		const row = result.map((d) => d[colNumber]);
		const meanValue = mean(row);
		const standardDeviationValue = std(row);
		result.map((value, [x, y], _) => {
			if (colNumber !== y) {
				return value;
			}

			return standarize(value, meanValue, standardDeviationValue);
		});
	}
	// headers.forEach((header) => {
	// 	const values = result.map((x) => parseFloat(x[header]));
	// 	const meanValue = mean(values);
	// 	const standardDeviationValue = std(values);

	// 	result = result.map((x) => {
	// 		const newX = x;
	// 		newX[header] = standarize(
	// 			parseFloat(newX[header]),
	// 			meanValue,
	// 			standardDeviationValue
	// 		);
	// 		return newX;
	// 	});
	// });
	return result;
};

export default standarizeData;
