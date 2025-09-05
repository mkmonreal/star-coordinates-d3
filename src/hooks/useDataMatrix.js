import { matrix, matrixFromColumns, multiply } from 'mathjs';
import { useMemo } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';
import { pca } from '../js/pca';

function useDataMatrix(
	originalData,
	selectedColumns,
	normalizationMethod,
	analysis,
	numArrows
) {
	const dataMatrix = useMemo(() => {
		let dataMatrix = null;
		let columnsDictionary = null;

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

		eigenDecomposition = createEigenDecomposition(
			analysis,
			originalMatrix,
			eigenDecomposition
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
		} else if (
			DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis
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
	}, [originalData, selectedColumns, normalizationMethod, analysis, numArrows]);

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
	eigenDecomposition
) {
	if (DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis) {
		const { principalComponents } = pca(originalMatrix);
		eigenDecomposition = principalComponents;
	} else if (
		DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
	) {
		console.log('LDA');
	}
	return eigenDecomposition;
}

export default useDataMatrix;
