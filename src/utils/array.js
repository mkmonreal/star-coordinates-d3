export const initializeMatrixArrayWithValues = (rows, columns, value = 0) =>
	Array(rows)
		.fill()
		.map(() => Array(columns).fill(value));
