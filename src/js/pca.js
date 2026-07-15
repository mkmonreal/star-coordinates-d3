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

import { eigs, subtract, norm, divide } from 'mathjs';
import { createCenteredMatrix, createCovarianceMatrix } from './operations';

export function pca(data) {
	const centeredMatrix = createCenteredMatrix(data);
	const covarianceMatrix = createCovarianceMatrix(data, centeredMatrix);
	const eigen = eigs(covarianceMatrix);

	return {
		principalComponents: eigen.eigenvectors
			.toSorted((a, b) => subtract(b.value, a.value))
			.map(createPrincipalComponent),
		centeredMatrix,
	};
}

const createPrincipalComponent = (eigen, index) => {
	const vectorNorm = norm(eigen.vector);
	const normalizedVector = divide(eigen.vector, vectorNorm);
	eigen.vector = normalizedVector;

	eigen.name = `PC${index + 1}`;
	return eigen;
};
