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
import {
	drawArrowLabel,
	enterArrows,
	exitArrows,
	updateArrows,
} from '../utils/d3-arrow';

function useD3ArrowRender(svgRef, vectors) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;
	const vectorVisualization = useConfigStore(
		(state) => state.vectorVisualization
	);

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}
		if (!vectors) {
			return;
		}

		const svgSelection = select(svgRef.current);
		svgSelection
			.select('.arrows')
			.selectAll('.arrow')
			.data(vectors, (vector) => vector.label)
			.join(
				(enter) => enterArrows(enter, unitCircleRadius, arrowHeadScale),
				(update) => updateArrows(update, unitCircleRadius, arrowHeadScale),
				exitArrows
			);
		drawArrowLabel(
			svgSelection,
			vectors,
			unitCircleRadius,
			vectorVisualization
		);
	}, [svgRef, vectors, unitCircleRadius, arrowHeadScale, vectorVisualization]);
}

export default useD3ArrowRender;
