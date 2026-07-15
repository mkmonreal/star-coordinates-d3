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
import { useEffect, useRef, useState } from 'react';
import useConfigStore from '../stores/config-store';

function usePointSelection(svgRef, points) {
	const selectionMode = useConfigStore((state) => state.selectionMode);
	const setSelectedPointIds = useConfigStore(
		(state) => state.setSelectedPointIds
	);
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);

	const [firstClick, setFirstClick] = useState(null);
	const [selectionRect, setSelectionRect] = useState(null);
	const justCompleted = useRef(false);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = select(svgRef.current);

		if (!selectionMode) {
			setFirstClick(null);
			setSelectionRect(null);
			justCompleted.current = false;
			svg.style('cursor', 'move');
			return;
		}

		if (justCompleted.current) {
			svg.style('cursor', 'move');
			justCompleted.current = false;
		} else {
			svg.style('cursor', 'crosshair');
		}

		const handleClick = (event) => {
			const svgElement = svgRef.current;
			const point = svgElement.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			const transformed = point.matrixTransform(
				svgElement.getScreenCTM().inverse()
			);

			if (!firstClick) {
				setFirstClick({ x: transformed.x, y: transformed.y });
				justCompleted.current = false;
			} else {
				const x1 = firstClick.x / unitCircleRadius;
				const y1 = -firstClick.y / unitCircleRadius;
				const x2 = transformed.x / unitCircleRadius;
				const y2 = -transformed.y / unitCircleRadius;

				const minX = Math.min(x1, x2);
				const maxX = Math.max(x1, x2);
				const minY = Math.min(y1, y2);
				const maxY = Math.max(y1, y2);

				const selectedPoints = points.filter(
					(point) =>
						point.x >= minX &&
						point.x <= maxX &&
						point.y >= minY &&
						point.y <= maxY
				);

				const selectedIds = new Set(selectedPoints.map((p) => p.id));
				setSelectedPointIds(selectedIds);

				justCompleted.current = true;
				setFirstClick(null);
				setSelectionRect(null);
			}
		};

		const handleMouseMove = (event) => {
			if (!firstClick) return;

			const svgElement = svgRef.current;
			const point = svgElement.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			const transformed = point.matrixTransform(
				svgElement.getScreenCTM().inverse()
			);

			setSelectionRect({
				x1: firstClick.x,
				y1: firstClick.y,
				x2: transformed.x,
				y2: transformed.y,
			});
		};

		svg.on('click', handleClick);
		svg.on('mousemove', handleMouseMove);

		return () => {
			svg.on('click', null);
			svg.on('mousemove', null);
			svg.style('cursor', 'move');
		};
	}, [
		svgRef,
		selectionMode,
		firstClick,
		points,
		setSelectedPointIds,
		unitCircleRadius,
	]);

	return {
		firstClick,
		selectionRect,
	};
}

export default usePointSelection;
