import { matrix, matrixFromColumns } from 'mathjs';
import { useEffect } from 'react';

const useDataMatrixCreator = (setDataMatrix, selectedColumns, originalData) => {
	useEffect(() => {
		const newDataMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => parseFloat(d[column]))
				)
			)
		);
		setDataMatrix(newDataMatrix);
	}, [selectedColumns, originalData, setDataMatrix]);
};

export default useDataMatrixCreator;
