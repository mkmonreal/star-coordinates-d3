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

import { extent } from 'd3';
import { isDenseMatrix, column, divide, subtract } from 'mathjs';

const normalize = (value, min, max) =>
	divide(subtract(value, min), subtract(max, min));

const normalizeData = (data) => {
	if (!isDenseMatrix(data)) {
		console.error('Data is not a matrix');
		return;
	}

	const mins = [];
	const maxs = [];
	const [_, nCols] = data.size();
	for (let ncol = 0; ncol < nCols; ncol++) {
		const col = column(data, ncol);
		const [min, max] = extent(col.toArray().flat());
		mins.push(min);
		maxs.push(max);
	}

	const normalizedData = data.map((value, index) => {
		const [_, ncol] = index;
		return normalize(value, mins[ncol], maxs[ncol]);
	});

	return normalizedData;
};

export default normalizeData;
