//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
