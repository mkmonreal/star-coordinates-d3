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

import { column, std, mean, isDenseMatrix, divide, subtract } from 'mathjs';

function standarize(value, meanValue, standardDeviationValue) {
	return 0 === standardDeviationValue
		? 0
		: divide(subtract(value, meanValue), standardDeviationValue);
}

const standarizeData = (data) => {
	if (!isDenseMatrix(data)) {
		console.error('Data is not a matrix');
		return;
	}

	const means = [];
	const standardDeviations = [];
	const [_, nCols] = data.size();

	for (let i = 0; i < nCols; i++) {
		const col = column(data, i);
		means.push(mean(col));
		standardDeviations.push(std(col));
	}

	const standarizedResult = data.map((value, index) => {
		const [_, j] = index;
		return standarize(value, means[j], standardDeviations[j]);
	});

	return standarizedResult;
};

export default standarizeData;
