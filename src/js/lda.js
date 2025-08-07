import {
	matrix,
	matrixFromColumns,
	subtract,
	transpose,
	multiply,
	add,
	eigs,
	inv,
	mean,
} from 'mathjs';
import standarizeData from './data/standarize';
import { initializeMatrixArrayWithValues } from '../utils/array';

export const lda = (dataMatrix, classesIndexesMap) => {
	if (!dataMatrix || !classesIndexesMap) {
		return;
	}

	const standarizedData = standarizeData(dataMatrix);
	const generalMeans = matrix(
		matrixFromColumns(
			standarizedData
				.columns()
				.map((column) => column.toArray().map((x) => x[0]))
				.map((column) => mean(column))
		)
	);
	const classes = new Set(classesIndexesMap.keys());
	const standarizedClassMatrixes = new Map();
	const classMeans = new Map();
	for (const classValue of classes) {
		const classIndexes = classesIndexesMap.get(classValue);
		const standarizedClassMatrix = matrix(
			standarizedData
				.toArray()
				.filter((_, index) => classIndexes.includes(index))
		);
		const classMean = matrix(
			matrixFromColumns(
				standarizedClassMatrix
					.columns()
					.map((column) => column.toArray().map((x) => x[0]))
					.map((column) => mean(column))
			)
		);
		standarizedClassMatrixes.set(classValue, standarizedClassMatrix);
		classMeans.set(classValue, classMean);
	}

	let intraClassScatter = matrix(
		initializeMatrixArrayWithValues(
			generalMeans.size()[0],
			generalMeans.size()[0]
		)
	);

	let interClassScatter = matrix(
		initializeMatrixArrayWithValues(
			generalMeans.size()[0],
			generalMeans.size()[0]
		)
	);

	for (const classValue of classes) {
		const classMean = classMeans.get(classValue);

		// Calculo de la matriz de dispersion intra-clases
		intraClassScatter = calculateIntraClassScatter(
			standarizedClassMatrixes,
			classValue,
			classMean,
			intraClassScatter
		);

		// Calculo de la matriz de dispersion entre-clases
		const difference = subtract(classMean, generalMeans);
		const differenceT = transpose(difference);
		const scatterMatrix = multiply(
			classesIndexesMap.get(classValue).length,
			multiply(difference, differenceT)
		);
		interClassScatter = add(scatterMatrix, interClassScatter);
	}

	const eigen = eigs(multiply(inv(intraClassScatter), interClassScatter));

	return {
		linearDiscriminants: eigen.eigenvectors
			.sort((a, b) => subtract(b.value, a.value))
			.map(createLinearDiscriminant),
	};
};

function calculateIntraClassScatter(
	standarizedClassMatrixes,
	classValue,
	classMean,
	intraClassScatter
) {
	const standarizedClassMatrix = standarizedClassMatrixes
		.get(classValue)
		.toArray();

	for (let valueRow of standarizedClassMatrix) {
		const value = matrix(matrixFromColumns(valueRow));
		const difference = subtract(value, classMean);
		const differenceT = transpose(difference);
		const scatterMatrix = multiply(difference, differenceT);
		intraClassScatter = add(scatterMatrix, intraClassScatter);
	}

	return intraClassScatter;
}

function createLinearDiscriminant(eigen, index) {
	eigen.name = `LD${index + 1}`;
	return eigen;
}
