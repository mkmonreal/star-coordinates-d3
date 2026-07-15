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
