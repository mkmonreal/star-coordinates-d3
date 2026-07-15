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

import { column, mean, transpose, multiply, subtract, divide } from 'mathjs';

export const createCenteredMatrix = (data) => {
	const [_, nCols] = data.size();
	const means = [];
	for (let i = 0; i < nCols; i++) {
		const col = column(data, i);
		means.push(mean(col));
	}

	const centeredMatrix = data.map((value, index) => {
		const [_, j] = index;
		return value - means[j];
	});

	return centeredMatrix;
};

export const createCovarianceMatrix = (data, centeredMatrix = null) => {
	const [nRows, nCols] = data.size();
	if (!centeredMatrix) {
		centeredMatrix = createCenteredMatrix(data);
	}
	const transposedMatrix = transpose(centeredMatrix);

	const covarianceMatrix = multiply(
		divide(1, subtract(nRows, 1)),
		multiply(transposedMatrix, centeredMatrix)
	);

	return covarianceMatrix;
};
