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

import { matrix, matrixFromColumns } from 'mathjs';
import { useMemo } from 'react';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';

function useDataProjection(originalData, selectedColumns, normalizationMethod) {
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
