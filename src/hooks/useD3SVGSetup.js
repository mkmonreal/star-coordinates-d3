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

import { drag, select } from 'd3';
import { useEffect, useRef } from 'react';
import useConfigStore from '../stores/config-store';

function useD3SVGSetup(width, height) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const svgRef = useRef();
	const currentViewBox = useRef({
		x: -width / 2,
		y: -height / 2,
		width,
		height,
	});

	useEffect(() => {
		const svg = select(svgRef.current);

		svg.selectAll('*').remove();

		svg
			.attr('width', width)
			.attr('height', height)
			.attr(
				'viewBox',
				`${currentViewBox.current.x} ${currentViewBox.current.y} ${width} ${height}`
			);

		svg
			.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', unitCircleRadius)
			.attr('stroke', 'grey')
			.attr('fill', 'none');

		svg.append('g').classed('arrows', true);
		svg.append('g').classed('data-circles', true);

		svg.call(
			drag().on('drag', (e) => {
				const x = currentViewBox.current.x - e.dx;
				const y = currentViewBox.current.y - e.dy;
				currentViewBox.current = { ...currentViewBox.current, x, y };
				svg.attr(
					'viewBox',
					`${currentViewBox.current.x} ${currentViewBox.current.y} ${currentViewBox.current.width} ${currentViewBox.current.height}`
				);
			})
		);

		return () => {
			svg.on('.drag', null);
		};
	}, [width, height, unitCircleRadius]);

	return { svgRef, currentViewBox };
}

export default useD3SVGSetup;
