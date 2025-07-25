import { mean } from 'd3';
import {
	matrix,
	subtract,
	transpose,
	multiply,
	prod,
	cross,
	add,
	isMatrix,
} from 'mathjs';
import standarizeData from './data/standarize';

export const lda = (dataMatrix, classesMatrixesMap) => {
	if (!dataMatrix || !classesMatrixesMap) {
		return;
	}

	const standarizedData = standarizeData(dataMatrix);
	const generalMeans = matrix([
		standarizedData
			.columns()
			.map((column) => column.toArray().map((x) => x[0]))
			.map((column) => mean(column)),
	]);
	const classes = Array.from(classesMatrixesMap.keys());
	const standarizedClassMatrixes = new Map();
	const classMeans = new Map();
	for (const classValue of classes) {
		const classMatrix = classesMatrixesMap.get(classValue);
		const standarizedClassMatrix = standarizeData(classMatrix);
		const classMean = matrix([
			standarizedClassMatrix
				.columns()
				.map((column) => column.toArray().map((x) => x[0]))
				.map((column) => mean(column)),
		]);
		standarizedClassMatrixes.set(classValue, standarizedClassMatrix);
		classMeans.set(classValue, classMean);
	}

	// Calculo de la matriz de dispersion intra-clases
	//const intraClassScatter;

	// Calculo de la matriz de dispersion entre-clases
	let interClassScatter = matrix(
		Array.from({ length: generalMeans.size() }, () =>
			Array(generalMeans.size()).fill(0)
		)
	);

	for (const classValue of classes) {
		const classMean = matrix(classMeans.get(classValue).toArray());
		console.log(isMatrix(classMean));
		console.log(isMatrix(generalMeans));
		const difference = subtract(classMean, generalMeans);
		const differenceT = transpose(difference);
		const scatterMatrix = multiply(differenceT, difference);
		interClassScatter = add(scatterMatrix, interClassScatter);
	}

	return interClassScatter;
};
