import { useEffect } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { pca } from '../js/pca';
import { matrix, matrixFromColumns, row } from 'mathjs';
import { buildCartesianVector } from '../utils/vector';

const useVectorsCreator = (
	createVectors,
	setVectors,
	analysis,
	columnsDict,
	dataMatrix
) => {
	useEffect(() => {
		if (!columnsDict) {
			return;
		}
		const columns = Object.keys(columnsDict);
		if (!columns || columns.length === 0) {
			return;
		}
		let newVectors = [];

		if (DimensionalityReductionStatisticalTechniquesEnum.NONE === analysis) {
			newVectors = createVectors(columns);
		} else if (
			DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis
		) {
			if (columns.length !== dataMatrix.size()[1]) {
				return;
			}

			const { principalComponents } = pca(dataMatrix);
			const [pc1, pc2] = principalComponents;
			const newVectorsMatrix = matrix(
				matrixFromColumns(pc1.vector, pc2.vector)
			);
			newVectors = columns.map((column, _, columns) => {
				const index = columnsDict[column];
				const vectorMatrix = row(newVectorsMatrix, index);
				const [x, y] = vectorMatrix.toArray()[0];
				const newVector = buildCartesianVector(
					x,
					y,
					column,
					`${column}_${columns.length}_${analysis}`
				);
				return newVector;
			});
		}

		setVectors(newVectors);
	}, [createVectors, setVectors, analysis, columnsDict, dataMatrix]);
};

export default useVectorsCreator;
