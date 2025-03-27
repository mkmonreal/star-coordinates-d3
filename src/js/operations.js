import { column, mean, transpose, multiply, subtract, divide } from 'mathjs';

export const createCenteredMatrix = (data) => {
	const [_, nCols] = data.size();
	const means = [];
	for (let i = 0; i < nCols; i++) {
		const col = column(data, i);
		means.push(mean(col));
	}

	const centeredMatrix = data.map((value, index) => {
		const [_, j] = index;
		return value - means[j];
	});

	return centeredMatrix;
};

export const createCovarianceMatrix = (data, centeredMatrix = null) => {
	const [_, nCols] = data.size();
	if (!centeredMatrix) {
		centeredMatrix = createCenteredMatrix(data);
	}
	const transposedMatrix = transpose(centeredMatrix);

	const covarianceMatrix = multiply(
		divide(1, subtract(nCols, 1)),
		multiply(transposedMatrix, centeredMatrix)
	);

	return covarianceMatrix;
};
