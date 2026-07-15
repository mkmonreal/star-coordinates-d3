//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useEffect, useMemo } from 'react';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import { lda } from '../js/lda';
import { pca } from '../js/pca';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { buildCartesianVector, buildPolarVector } from '../utils/vector';
import { osc } from '../js/osc';

function useVectors(columnsIndexMap, analysis, matrix, classesIndexesMap) {
	const vectorsInitialized = useConfigStore(
		(state) => state.vectorsInitialized
	);
	const setVectorsInitialized = useConfigStore(
		(state) => state.setVectorsInitialized
	);

	const vectors = useStarCoordinatesStore((state) => state.vectors);
	const setVectors = useStarCoordinatesStore((state) => state.setVectors);

	const initialVectors = useMemo(() => {
		if (!columnsIndexMap) {
			return;
		}
		if (!analysis) {
			return;
		}
		if (DimensionalityReductionEnum.LDA === analysis && !classesIndexesMap) {
			return;
		}

		let columnsNames = Array.from(columnsIndexMap.keys());

		if (DimensionalityReductionEnum.NONE === analysis) {
			if (vectorsInitialized) {
				return vectors;
			}
			return createInitalVectors(columnsNames);
		}

		if (DimensionalityReductionEnum.OSC === analysis) {
			const newVectors = osc(vectors);
			console.log(newVectors);
			return newVectors;
		}

		const eigenDecomposition = createEigenDecomposition(
			analysis,
			matrix,
			classesIndexesMap
		);
		const [newXVector, newYVector] = eigenDecomposition
			.slice(0, 2)
			.map((e) => e.vector.toArray());
		const newVectors = [];
		for (const [column, index] of columnsIndexMap.entries()) {
			const newVector = buildCartesianVector(
				newXVector[index],
				newYVector[index],
				column,
				column
			);
			newVectors.push(newVector);
		}

		return newVectors;
	}, [
		analysis,
		matrix,
		classesIndexesMap,
		columnsIndexMap,
		vectorsInitialized,
		vectors,
	]);

	useEffect(() => {
		if (!vectorsInitialized) {
			setVectors(initialVectors);
			setVectorsInitialized(true);
		}
	}, [initialVectors, vectorsInitialized, setVectorsInitialized, setVectors]);

	return [vectors, setVectors];
}

function createInitalVectors(columns) {
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

function createEigenDecomposition(analysis, matrix, classesIndexesMap) {
	if (DimensionalityReductionEnum.PCA === analysis) {
		const { principalComponents } = pca(matrix);
		return principalComponents;
	} else if (DimensionalityReductionEnum.LDA === analysis) {
		if (!classesIndexesMap || 0 === classesIndexesMap.size) {
			return [];
		}
		const { linearDiscriminants } = lda(matrix, classesIndexesMap);
		return linearDiscriminants;
	} else if (DimensionalityReductionEnum.OSC === analysis) {
	}
}

export default useVectors;
