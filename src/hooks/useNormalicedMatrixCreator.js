import { useEffect } from 'react';

const useNormalicedMatrixCreator = (
	setNormalizedMatrix,
	normalizationMethod,
	dataMatrix
) => {
	useEffect(() => {
		if (!dataMatrix) {
			return;
		}
		if (!normalizationMethod) {
			return;
		}
		if (!setNormalizedMatrix) {
			return;
		}

		setNormalizedMatrix(normalizationMethod(dataMatrix));
	}, [dataMatrix, normalizationMethod, setNormalizedMatrix]);
};

export default useNormalicedMatrixCreator;
