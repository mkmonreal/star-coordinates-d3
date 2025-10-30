//    Copyright 2025 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { useMemo, useState, useEffect } from 'react';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import { lda } from '../js/lda';
import { pca } from '../js/pca';
import { buildCartesianVector, buildPolarVector } from '../utils/vector';
import useConfigStore from '../stores/config-store';

function useVectors(columnsIndexMap, analysis, matrix, classesIndexesMap) {
	const vectorsInitialized = useConfigStore(
		(state) => state.vectorsInitialized
	);
	const setVectorsInitialized = useConfigStore(
		(state) => state.setVectorsInitialized
	);

	const [vectors, setVectors] = useState();

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
	}, [initialVectors, vectorsInitialized, setVectorsInitialized]);

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
	}
}

export default useVectors;
