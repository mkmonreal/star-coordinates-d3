import { useEffect, useState } from 'react';
import { buildPolarVector } from '../utils/vector';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';

function useVectors(columnsDictionary, analysis, numArrows) {
	const [vectors, setVectors] = useState();

	useEffect(() => {
		if (!columnsDictionary) {
			return;
		}

		let columnsNames = Array.from(columnsDictionary.keys());
		if (DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis) {
			columnsNames = columnsNames.slice(0, numArrows);
		}
		if (DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis) {
			columnsNames = columnsNames.slice(0, numArrows);
		}
		setVectors(createVectors(columnsNames));
	}, [columnsDictionary, analysis, numArrows]);

	return [vectors, setVectors];
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
		const vector = buildPolarVector(module, angle, validHeader, validHeader);
		vectors.push(vector);
	}

	return vectors;
}

export default useVectors;
