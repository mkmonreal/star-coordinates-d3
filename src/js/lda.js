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

import {
	add,
	divide,
	eigs,
	inv,
	matrix,
	matrixFromColumns,
	mean,
	multiply,
	norm,
	subtract,
	transpose,
} from 'mathjs';
import { initializeMatrixArrayWithValues } from '../utils/array';

export function lda(dataMatrix, classesIndexesMap) {
	if (!dataMatrix || !classesIndexesMap) {
		return;
	}

	const generalMeans = matrix(
		matrixFromColumns(
			dataMatrix
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
			dataMatrix.toArray().filter((_, index) => classIndexes.includes(index))
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
			.toSorted((a, b) => subtract(b.value, a.value))
			.map(createLinearDiscriminant),
	};
}

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
	const vectorNorm = norm(eigen.vector);
	const normalizedVector = divide(eigen.vector, vectorNorm);
	eigen.vector = normalizedVector;

	eigen.name = `LD${index + 1}`;
	return eigen;
}
