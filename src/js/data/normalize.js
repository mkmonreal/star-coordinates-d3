import { extent } from 'd3';
import { isDenseMatrix, column, divide, subtract } from 'mathjs';

const normalize = (value, min, max) =>
	divide(subtract(value, min), subtract(max, min));

const normalizeData = (data) => {
	if (!isDenseMatrix(data)) {
		console.error('Data is not a matrix');
		return;
	}

	const mins = [];
	const maxs = [];
	const [_, nCols] = data.size();
	for (let ncol = 0; ncol < nCols; ncol++) {
		const col = column(data, ncol);
		const [min, max] = extent(col.toArray().flat());
		mins.push(min);
		maxs.push(max);
	}

	const normalizedData = data.map((value, index) => {
		const [_, ncol] = index;
		return normalize(value, mins[ncol], maxs[ncol]);
	});

	return normalizedData;
};

export default normalizeData;
