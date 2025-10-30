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
