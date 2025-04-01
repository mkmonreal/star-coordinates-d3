import { useEffect } from 'react';

const useColumnsDictCreator = (setColumnsDict, selectedColumns) => {
	useEffect(() => {
		if (!selectedColumns || selectedColumns.length === 0) {
			return;
		}

		const columnsDict = selectedColumns.reduce((acc, column, index) => {
			acc[column] = index;
			return acc;
		}, {});
		setColumnsDict(columnsDict);
	}, [selectedColumns, setColumnsDict]);
};

export default useColumnsDictCreator;
