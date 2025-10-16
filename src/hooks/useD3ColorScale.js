import { scaleOrdinal } from 'd3';
import { useMemo } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

function useD3ColorScale(selectedClassColumn) {
	const colorset = useConfigStore((state) => state.colorset);

	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const classesSet = useMemo(() => {
		if (!selectedClassColumn) {
			return new Set();
		}

		return new Set(originalData.map((d) => d[selectedClassColumn]));
	}, [originalData, selectedClassColumn]);

	const selectColor = useMemo(() => {
		if (!classesSet || 0 === classesSet.size) {
			return;
		}

		const sortedClasses = Array.from(classesSet.values()).sort();
		const colorsArray = sortedClasses.map((_, index, classes) =>
			colorset.interpolate(index / (classes.length - 1))
		);
		const newSelectColor = scaleOrdinal(sortedClasses, colorsArray);

		return newSelectColor;
	}, [classesSet, colorset]);

	return { classesSet, selectColor };
}

export default useD3ColorScale;
