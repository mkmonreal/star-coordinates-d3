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

import { matrix, matrixFromColumns } from 'mathjs';
import { useMemo } from 'react';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';

function useDataProjection(normalizationMethod, originalData, selectedColumns) {
	const dataProjection = useMemo(() => {
		const originalMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => Number.parseFloat(d[column]))
				)
			)
		);

		const normalizationFunc = selectNormalizationMethod(normalizationMethod);
		const dataMatrix = normalizationFunc(originalMatrix);
		const columnsIndexMap = selectedColumns.reduce((map, column, index) => {
			map.set(column, index);
			return map;
		}, new Map());

		return { dataMatrix, columnsIndexMap };
	}, [originalData, selectedColumns, normalizationMethod]);

	return dataProjection;
}

function selectNormalizationMethod(method) {
	switch (method) {
		case NormalizationMethodEnum.MIN_MAX:
			return normalizeData;
		case NormalizationMethodEnum.Z_SCORE:
			return standarizeData;
		default:
			return normalizeData;
	}
}

export default useDataProjection;
