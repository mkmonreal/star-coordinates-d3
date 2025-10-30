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
	const [_, nCols] = data.size();
	if (!centeredMatrix) {
		centeredMatrix = createCenteredMatrix(data);
	}
	const transposedMatrix = transpose(centeredMatrix);

	const covarianceMatrix = multiply(
		divide(1, subtract(nCols, 1)),
		multiply(transposedMatrix, centeredMatrix)
	);

	return covarianceMatrix;
};
