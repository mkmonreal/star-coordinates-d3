import { matrix, matrixFromColumns } from 'mathjs';
import { useMemo } from 'react';

function useMatrix(originalData, selectedColumns) {
	const matrixMemo = useMemo(() => {
		const newMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => parseFloat(d[column]))
				)
			)
		);
		return newMatrix;
	}, [originalData, selectedColumns]);

	return matrixMemo;
}

export default useMatrix;
