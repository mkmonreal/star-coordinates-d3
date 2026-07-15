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

import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import {
	enterDataCircle,
	exitDataCircle,
	updateDataCircle,
} from '../utils/d3-data-circle';
import useD3ColorScale from './useD3ColorScale';

function useD3DataCircleRender(svgRef, points) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const opacity = useConfigStore((state) => state.opacity);
	const radius = useConfigStore((state) => state.radius);
	const selectedPointIds = useConfigStore((state) => state.selectedPointIds);

	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);

	const { selectColor } = useD3ColorScale(selectedClassColumn);

	useEffect(() => {
		if (!points) {
			return;
		}

		const svg = select(svgRef.current);

		svg
			.select('.data-circles')
			.selectAll('.data-circle')
			.data(points, (point) => `${point.id}`)
			.join(
				(enter) =>
					enterDataCircle(
						enter,
						unitCircleRadius,
						radius,
						opacity,
						selectColor,
						selectedClassColumn,
						selectedPointIds
					),
				(update) =>
					updateDataCircle(
						update,
						unitCircleRadius,
						selectColor,
						selectedClassColumn,
						selectedPointIds,
						opacity
					),
				exitDataCircle
			);
	}, [
		svgRef,
		points,
		unitCircleRadius,
		selectColor,
		selectedClassColumn,
		selectedPointIds,
		radius,
		opacity,
	]);
}

export default useD3DataCircleRender;
