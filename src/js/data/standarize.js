import { column, std, mean, isDenseMatrix, divide, subtract } from 'mathjs';

function standarize(value, meanValue, standardDeviationValue) {
	return divide(subtract(value, meanValue), standardDeviationValue);
}

const standarizeData = (data) => {
	if (!isDenseMatrix(data)) {
		console.error('Data is not a matrix');
		return;
	}

	const means = [];
	const standardDeviations = [];
	const [_, nCols] = data.size();

	for (let i = 0; i < nCols; i++) {
		const col = column(data, i);
		means.push(mean(col));
		standardDeviations.push(std(col));
	}

	const standarizedResult = data.map((value, index) => {
		const [_, j] = index;
		return standarize(value, means[j], standardDeviations[j]);
	});

	return standarizedResult;
};

export default standarizeData;
