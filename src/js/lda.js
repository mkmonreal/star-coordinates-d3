import { mean } from 'd3';
import { matrix } from 'mathjs';
import standarizeData from './data/standarize';

export const lda = (dataMatrix, classesMatrixesMap) => {
	if (!dataMatrix || !classesMatrixesMap) {
		return;
	}

	const standarizedData = standarizeData(dataMatrix);
	const generalMeans = matrix(
		standarizedData
			.columns()
			.map((column) => column.toArray().map((x) => x[0]))
			.map((column) => mean(column))
	);
	const classes = classesMatrixesMap.keys();
	const classMeans = new Map();
	for (const classValue of classes) {
		const classMatrix = classesMatrixesMap.get(classValue);
		const classMean = matrix(
			classMatrix
				.columns()
				.map((column) => column.toArray().map((x) => x[0]))
				.map((column) => mean(column))
		);
		classMeans.set(classValue, classMean);
	}

	return;
};
