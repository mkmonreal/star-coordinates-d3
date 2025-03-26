import { column, mean, transpose, multiply, subtract, divide } from 'mathjs';

export const createCovarianceMatrix = (data) => {
	const [_, nCols] = data.size();
	const means = [];
	for (let i = 0; i < nCols; i++) {
		const col = column(data, i);
		means.push(mean(col));
	}

	const centeredMatriz = data.map((value, index) => {
		const [_, j] = index;
		return value - means[j];
	});
	const transposedMatrix = transpose(centeredMatriz);

	const covarianceMatrix = multiply(
		divide(1, subtract(nCols, 1)),
		multiply(transposedMatrix, centeredMatriz)
	);
	return covarianceMatrix;
};
