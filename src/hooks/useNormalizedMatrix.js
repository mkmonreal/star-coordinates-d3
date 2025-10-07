import { useMemo } from 'react';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';

function useNormalizedMatrix(newMatrix, normalizationMethod) {
	const normalizedMatrixMemo = useMemo(() => {
		const normalizationFunc = selectNormalizationMethod(normalizationMethod);

		const newNomalizedMatrix = normalizationFunc(newMatrix);

		return newNomalizedMatrix;
	}, [newMatrix, normalizationMethod]);

	return normalizedMatrixMemo;
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

export default useNormalizedMatrix;
