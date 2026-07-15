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

import { useMemo } from 'react';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';

function useClassesIndexMap(analysis, originalData, selectedClassColumn) {
	const classesIndexMap = useMemo(() => {
		if (DimensionalityReductionEnum.LDA !== analysis) {
			return;
		}
		if (!selectedClassColumn) {
			return;
		}

		const classesIndexMap = new Map();
		const classes = originalData.map((d) => d[selectedClassColumn]);
		for (const [index, value] of classes.entries()) {
			if (!classesIndexMap.has(value)) {
				classesIndexMap.set(value, []);
			}
			classesIndexMap.get(value).push(index);
		}

		return classesIndexMap;
	}, [analysis, originalData, selectedClassColumn]);

	return classesIndexMap;
}

export default useClassesIndexMap;
