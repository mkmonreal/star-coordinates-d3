import { matrix, matrixFromColumns, multiply } from 'mathjs';
import { useMemo } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';
import { pca } from '../js/pca';
import { lda } from '../js/lda';

function useDataProjection(
	originalData,
	selectedColumns,
	normalizationMethod,
	analysis,
	numArrows,
	selectedClassColumn
) {
	const dataProjection = useMemo(() => {
		let dataMatrix = [];
		let columnsIndexMap = new Map();

		let eigenDecomposition = [];
		let classesIndexesMap = new Map();

		let eigenVectorsMatrix = matrix();
		let transformedDataMatrix = matrix();

		const originalMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => Number.parseFloat(d[column]))
				)
			)
		);

		const normalizationFunc = selectNormalizationMethod(normalizationMethod);

		const normalizedMatrix = normalizationFunc(originalMatrix);
		dataMatrix = normalizedMatrix;

		switch (analysis) {
			case DimensionalityReductionStatisticalTechniquesEnum.NONE:
				columnsIndexMap = selectedColumns.reduce((map, column, index) => {
					map.set(column, index);
					return map;
				}, new Map());
				return { dataMatrix, columnsIndexMap };
			case DimensionalityReductionStatisticalTechniquesEnum.LDA:
			case DimensionalityReductionStatisticalTechniquesEnum.PCA:
				if (selectedClassColumn) {
					classesIndexesMap = originalData.reduce((acc, value, index) => {
						const className = value[selectedClassColumn];
						if (!acc.has(className)) {
							acc.set(className, []);
						}
						acc.get(className).push(index);
						return acc;
					}, new Map());
				}

				eigenDecomposition = createEigenDecomposition(
					analysis,
					originalMatrix,
					classesIndexesMap
				);

				if (!eigenDecomposition || 0 === eigenDecomposition.length) {
					return { dataMatrix, columnsIndexMap };
				}

				eigenVectorsMatrix = matrix(
					matrixFromColumns(
						...eigenDecomposition
							.slice(0, numArrows)
							.map((e) => e.vector.toArray())
					)
				);

				if (normalizedMatrix.size()[1] !== eigenVectorsMatrix.size()[0]) {
					return;
				}

				transformedDataMatrix = multiply(normalizedMatrix, eigenVectorsMatrix);
				dataMatrix = transformedDataMatrix;

				columnsIndexMap = eigenDecomposition.reduce((map, eigen, index) => {
					map.set(eigen.name, index);
					return map;
				}, new Map());
		}
		return { dataMatrix, columnsIndexMap };
	}, [
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows,
		selectedClassColumn,
	]);

	return dataProjection;
}

function selectNormalizationMethod(method) {
	switch (method) {
		case NormalizationMethodEnum.MIN_MAX:
			return normalizeData;
		case NormalizationMethodEnum.Z_SCORE:
			return standarizeData;
		default:
			return normalizeData;
	}
}

function createEigenDecomposition(analysis, originalMatrix, classesIndexesMap) {
	if (DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis) {
		const { principalComponents } = pca(originalMatrix);
		return principalComponents;
	} else if (
		DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
	) {
		if (!classesIndexesMap || 0 === classesIndexesMap.size) {
			return [];
		}
		const { linearDiscriminants } = lda(originalMatrix, classesIndexesMap);
		return linearDiscriminants;
	}
}

export default useDataProjection;
