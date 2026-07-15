//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
