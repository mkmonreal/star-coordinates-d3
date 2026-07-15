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
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import {
	appendArrowText,
	drawArrowLabel,
	enterArrows,
	exitArrows,
	updateArrows,
} from '../utils/d3-arrow';
import {
	enterDataCircle,
	exitDataCircle,
	updateDataCircle,
} from '../utils/d3-data-circle';
import { calculatePoints } from '../utils/data-projection';
import { buildCartesianVector } from '../utils/vector';
import useD3ColorScale from './useD3ColorScale';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';

function useD3ArrowDrag(setVectors, svgRef, points, vectors, dataMatrix) {
	const vectorVisualization = useConfigStore(
		(state) => state.vectorVisualization
	);
	const analysis = useConfigStore((state) => state.analysis);
	const setAnalysis = useConfigStore((state) => state.setAnalysis);
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;
	const selectedPointIds = useConfigStore((state) => state.selectedPointIds);
	const radius = useConfigStore((state) => state.radius);
	const opacity = useConfigStore((state) => state.opacity);

	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);

	const { selectColor } = useD3ColorScale(selectedClassColumn);

	const currentPoints = useRef(points);
	const currentVectors = useRef(vectors);
	const currentDataMatrix = useRef(dataMatrix);
	const currentSelectedPointIds = useRef(selectedPointIds);
	const currentRadius = useRef(radius);
	const currentOpacity = useRef(opacity);

	useEffect(() => {
		currentVectors.current = vectors;
		currentDataMatrix.current = dataMatrix;
		currentPoints.current = points;
		currentSelectedPointIds.current = selectedPointIds;
		currentRadius.current = radius;
		currentOpacity.current = opacity;
	}, [vectors, dataMatrix, points, selectedPointIds, radius, opacity]);

	useEffect(() => {
		const svg = select(svgRef.current);
		svg.selectAll('.arrow-head').call((arrowHead) => {
			arrowHead.call(
				drag()
					.on('start', () => {
						svg.style('cursor', 'grabbing');
						arrowHead.style('cursor', 'grabbing');
					})
					.on('drag', (e) => {
						dragHandler({
							e,
							svg,
							selectColor,
							currentVectors,
							currentDataMatrix,
							currentPoints,
							originalData,
							selectedClassColumn,
							unitCircleRadius,
							arrowHeadScale,
							vectorVisualization,
							currentSelectedPointIds,
							currentRadius,
							currentOpacity,
						});
					})
					.on('end', () => {
						svg.style('cursor', 'move');
						arrowHead.style('cursor', 'grab');
						setVectors(currentVectors.current);

						if (DimensionalityReductionEnum.NONE !== analysis) {
							setAnalysis(DimensionalityReductionEnum.NONE);
						}
					})
			);

			arrowHead.on('mouseover', null);
			arrowHead.on('mouseout', null);
			if (
				VectorNameVisualizationEnum.HOVER.value === vectorVisualization.value
			) {
				arrowHead.on('mouseover', (event) => {
					const currentArrow = select(event.currentTarget.parentNode);
					const currentArrowText = currentArrow.select('.arrow-text');
					if (!currentArrowText.node()) {
						appendArrowText(currentArrow, unitCircleRadius);
					}
				});

				arrowHead.on('mouseout', () => {
					const currentCursor = svg.style('cursor');
					if ('grabbing' !== currentCursor) {
						svg.selectAll('.arrow-text').remove();
					}
				});
			}
		});
	}, [
		setVectors,
		selectColor,
		svgRef,
		originalData,
		selectedClassColumn,
		unitCircleRadius,
		arrowHeadScale,
		analysis,
		setAnalysis,
		vectorVisualization,
	]);
}

function dragHandler({
	e,
	svg,
	selectColor,
	currentVectors,
	currentDataMatrix,
	currentPoints,
	originalData,
	selectedClassColumn,
	unitCircleRadius,
	arrowHeadScale,
	vectorVisualization,
	currentSelectedPointIds,
	currentRadius,
	currentOpacity,
}) {
	const prevVector = currentVectors.current.find(
		(vector) => e.subject.id === vector.id
	);
	const newVector = buildCartesianVector(
		prevVector.cartesian.x + e.dx / unitCircleRadius,
		prevVector.cartesian.y - e.dy / unitCircleRadius,
		prevVector.label,
		prevVector.id
	);
	currentVectors.current = currentVectors.current.map((currentVector) =>
		newVector.id === currentVector.id ? newVector : currentVector
	);
	currentPoints.current = calculatePoints(
		currentVectors.current,
		currentDataMatrix.current,
		originalData
	);
	svg
		.selectAll('.arrow')
		.data(currentVectors.current, (d) => d.id)
		.join(
			(enter) => {
				enterArrows(enter, unitCircleRadius, arrowHeadScale);
			},
			(update) => {
				updateArrows(update, unitCircleRadius, arrowHeadScale);
			},
			exitArrows
		);

	svg
		.selectAll('.data-circle')
		.data(currentPoints.current, (point) => `${point.id}`)
		.join(
			(enter) => {
				enterDataCircle(
					enter,
					unitCircleRadius,
					currentRadius.current,
					currentOpacity.current,
					selectColor,
					selectedClassColumn,
					currentSelectedPointIds.current
				);
			},
			(update) => {
				updateDataCircle(
					update,
					unitCircleRadius,
					selectColor,
					selectedClassColumn,
					currentSelectedPointIds.current,
					currentOpacity.current
				);
			},
			exitDataCircle
		);

	drawArrowLabel(
		svg,
		currentVectors.current,
		unitCircleRadius,
		vectorVisualization
	);
}

export default useD3ArrowDrag;
