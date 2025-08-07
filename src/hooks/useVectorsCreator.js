import { useEffect } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { pca } from '../js/pca';
import { matrix, matrixFromColumns, row } from 'mathjs';
import { buildCartesianVector } from '../utils/vector';
import { lda } from '../js/lda';

const useVectorsCreator = (
	createVectors,
	setVectors,
	analysis,
	columnsDict,
	dataMatrix,
	classesDataMatrixes
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

			newVectors = createVectorsPCA(dataMatrix, columns, columnsDict);
		} else if (
			DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
		) {
			newVectors = createVectorsLDA(
				dataMatrix,
				classesDataMatrixes,
				columns,
				columnsDict
			);
		}

		setVectors(newVectors);
	}, [
		createVectors,
		setVectors,
		analysis,
		columnsDict,
		dataMatrix,
		classesDataMatrixes,
	]);
};

function createVectorsPCA(dataMatrix, columns, columnsDict) {
	const { principalComponents } = pca(dataMatrix);
	const [pc1, pc2] = principalComponents;
	const newVectorsMatrix = matrix(matrixFromColumns(pc1.vector, pc2.vector));
	const newVectors = columns.map((column, _, columns) => {
		const index = columnsDict[column];
		const vectorMatrix = row(newVectorsMatrix, index);
		const [x, y] = vectorMatrix.toArray()[0];
		const newVector = buildCartesianVector(
			x,
			y,
			column,
			`${column}_${columns.length}`
		);
		return newVector;
	});
	return newVectors;
}

function createVectorsLDA(
	dataMatrix,
	classesDataMatrixes,
	columns,
	columnsDict
) {
	if (!dataMatrix || !classesDataMatrixes) {
		return;
	}

	const { linearDiscriminants } = lda(dataMatrix, classesDataMatrixes);
	const [ld1, ld2] = linearDiscriminants;
	const newVectorsMatrix = matrix(matrixFromColumns(ld1.vector, ld2.vector));
	const newVectors = columns.map((column, _, columns) => {
		const index = columnsDict[column];
		const vectorMatrix = row(newVectorsMatrix, index);
		const [x, y] = vectorMatrix.toArray()[0];
		const newVector = buildCartesianVector(
			x,
			y,
			column,
			`${column}_${columns.length}_${DimensionalityReductionStatisticalTechniquesEnum.PCA}`
		);
		return newVector;
	});
	return newVectors;
}

export default useVectorsCreator;
