//    Copyright 2026 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { matrix } from 'mathjs';
import { buildCartesianVector } from '../utils/vector';
import { row } from 'mathjs';
import { column } from 'mathjs';
import { sqrt } from 'mathjs';
import { sum } from 'mathjs';
import { square } from 'mathjs';
import { divide } from 'mathjs';
import { matrixFromColumns } from 'mathjs';
import { dot } from 'mathjs';
import { multiply } from 'mathjs';
import { subtract } from 'mathjs';

export function osc(vectors) {
	if (!vectors || vectors.length === 0) {
		return undefined;
	}

	const vectorMatrix = matrix(
		vectors.map((vector) => [vector.cartesian.x, vector.cartesian.y])
	);

	const x = column(vectorMatrix, 0).toArray()?.flat(); // [x₁, x₂, ..., xₙ]
	const y = column(vectorMatrix, 1).toArray()?.flat(); // [y₁, y₂, ..., yₙ]

	const xNorm = length(x);
	const xNormalized = divide(x, xNorm);

	const dotYX = dot(y, xNormalized);
	const projection = multiply(dotYX, xNormalized);
	const yOrthogonal = subtract(y, projection);

	const yNormalized = divide(yOrthogonal, length(yOrthogonal));

	const newVectorMatrix = matrix(matrixFromColumns(xNormalized, yNormalized));

	const newVectors = vectors.map((vector, index) => {
		const matrixRow = row(newVectorMatrix, index).toArray()[0];
		const newRow = buildCartesianVector(
			matrixRow[0],
			matrixRow[1],
			vector.label,
			vector.id
		);
		return newRow;
	});

	return newVectors;
}

function length(vector) {
	return sqrt(sum(vector.map((e) => square(e))));
}
