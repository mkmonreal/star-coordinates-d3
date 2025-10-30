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
