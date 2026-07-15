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
