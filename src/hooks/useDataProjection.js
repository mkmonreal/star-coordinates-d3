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
