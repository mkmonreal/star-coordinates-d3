import { useMemo } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { buildPolarVector } from '../utils/vector';

function useInitialVectors(columnsDictionary, analysis, numArrows) {
	return useMemo(() => {
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
		return createVectors(columnsNames);
	}, [columnsDictionary, analysis, numArrows]);
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

export default useInitialVectors;
