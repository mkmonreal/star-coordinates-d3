//    Copyright 2025 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

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
