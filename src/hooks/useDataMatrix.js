import { matrix, matrixFromColumns, multiply } from 'mathjs';
import { useMemo } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';
import { pca } from '../js/pca';
import { lda } from '../js/lda';

function useDataMatrix(
	originalData,
	selectedColumns,
	normalizationMethod,
	analysis,
	numArrows,
	selectedClassColumn
) {
	const dataMatrix = useMemo(() => {
		let dataMatrix = null;
		let columnsDictionary = null;
		let classesIndexesMap = null;

		const originalMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => parseFloat(d[column]))
				)
			)
		);

		const normalizationFunc = selectNormalizationMethod(normalizationMethod);

		const normalizedMatrix = normalizationFunc(originalMatrix);
		dataMatrix = normalizedMatrix;

		let eigenDecomposition = null;
		if (selectedClassColumn) {
			const distinctClasses = new Set(
				originalData.map((d) => d[selectedClassColumn])
			);

			if (!distinctClasses) {
				return;
			}

			classesIndexesMap = distinctClasses
				.values()
				.reduce((acc, uniqueClass) => {
					acc.set(
						uniqueClass,
						originalData
							.filter((d) => uniqueClass === d[selectedClassColumn])
							.map((_, i) => i)
					);
					return acc;
				}, new Map());
		}

		eigenDecomposition = createEigenDecomposition(
			analysis,
			originalMatrix,
			eigenDecomposition,
			classesIndexesMap
		);

		if (!eigenDecomposition) {
			columnsDictionary = selectedColumns.reduce((map, column, index) => {
				map.set(column, index);
				return map;
			}, new Map());
			return { dataMatrix, columnsDictionary };
		}

		if (DimensionalityReductionStatisticalTechniquesEnum.NONE === analysis) {
			return;
		}

		if (
			DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis ||
			DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
		) {
			if (!eigenDecomposition || 0 === eigenDecomposition.length) {
				return;
			}
			const eigenVectorsMatrix = matrix(
				matrixFromColumns(
					...eigenDecomposition
						.slice(0, numArrows)
						.map((e) => e.vector.toArray())
				)
			);

			if (normalizedMatrix.size()[1] !== eigenVectorsMatrix.size()[0]) {
				return;
			}

			const transformedDataMatrix = multiply(
				normalizedMatrix,
				eigenVectorsMatrix
			);
			dataMatrix = transformedDataMatrix;

			columnsDictionary = eigenDecomposition.reduce((map, eigen, index) => {
				map.set(eigen.name, index);
				return map;
			}, new Map());
		}
		return { dataMatrix, columnsDictionary };
	}, [
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows,
		selectedClassColumn,
	]);

	return dataMatrix;
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

function createEigenDecomposition(
	analysis,
	originalMatrix,
	eigenDecomposition,
	classesIndexesMap
) {
	if (DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis) {
		const { principalComponents } = pca(originalMatrix);
		eigenDecomposition = principalComponents;
	} else if (
		DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
	) {
		if (!classesIndexesMap) {
			return eigenDecomposition;
		}
		const { linearDiscriminants } = lda(originalMatrix, classesIndexesMap);
		eigenDecomposition = linearDiscriminants;
	}
	return eigenDecomposition;
}

export default useDataMatrix;
