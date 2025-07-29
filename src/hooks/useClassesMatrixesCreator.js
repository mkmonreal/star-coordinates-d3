import { useEffect } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { matrix, matrixFromColumns } from 'mathjs';

const useClassesMatrixesCreator = (
	setClassesMatrixMap,
	setClasses,
	analysis,
	selectedClassColumn,
	selectedColumns,
	originalData
) => {
	useEffect(() => {
		if (
			!analysis ||
			DimensionalityReductionStatisticalTechniquesEnum.LDA !== analysis
		) {
			return;
		}

		if (
			!selectedClassColumn ||
			!selectedColumns ||
			selectedColumns.length === 0
		) {
			return;
		}

		const classesMatrixesMap = new Map();
		const classes = new Set(originalData.map((d) => d[selectedClassColumn]));

		for (const classValue of classes) {
			const values = originalData.filter(
				(data) => data[selectedClassColumn] === classValue
			);
			classesMatrixesMap.set(
				classValue,
				matrix(
					matrixFromColumns(
						...selectedColumns.map((column) =>
							values.map((d) => parseFloat(d[column]))
						)
					)
				)
			);
		}

		const indexesMap = new Map();
		for (const classValue of classes) {
			const indexes = originalData
				.map((data, index) => ({
					index,
					data,
				}))
				.filter((data) => classValue === data.data[selectedClassColumn])
				.map((data) => data.index);
			indexesMap.set(classValue, indexes);
		}

		setClasses(classes);
		setClassesMatrixMap(indexesMap);
	}, [
		setClassesMatrixMap,
		setClasses,
		analysis,
		selectedClassColumn,
		selectedColumns,
		originalData,
	]);
};

export default useClassesMatrixesCreator;
