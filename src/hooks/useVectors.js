import { useEffect, useState } from 'react';
import { buildPolarVector } from '../utils/vector';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';

// function useVectors(columnsDictionary) {
// 	const [vectors, setVectors] = useState();

// 	useEffect(() => {
// 		const columnsNames = Array.from(columnsDictionary.keys());
// 		setVectors(createVectors(columnsNames));
// 	}, [columnsDictionary]);

// 	return [vectors, setVectors];
// }

function useVectors(setVectors, columnsDictionary) {
	useEffect(() => {
		const columnsNames = Array.from(columnsDictionary.keys());
		setVectors(createVectors(columnsNames));
	}, [setVectors, columnsDictionary]);
}

function createVectors(columns) {
	if (!columns || columns.length === 0) {
		return;
	}

	let initialAngle = 0;
	if (columns.length > 2) {
		initialAngle = 90;
	}

	const vectors = [];
	const angleDiff = 360 / columns.length;

	for (const [index, validHeader] of columns.entries()) {
		const module = 1;
		const angle = (index * angleDiff + initialAngle) % 360;
		const vector = buildPolarVector(
			module,
			angle,
			validHeader,
			`${validHeader}_${columns.length}_${DimensionalityReductionStatisticalTechniquesEnum.NONE}`
		);
		vectors.push(vector);
	}

	return vectors;
}

export default useVectors;
