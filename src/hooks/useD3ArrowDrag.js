import { drag, select } from 'd3';
import { useEffect, useRef } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { enterArrows, exitArrows, updateArrows } from '../utils/d3-arrow';
import {
	enterDataCircle,
	exitDataCircle,
	updateDataCircle,
} from '../utils/d3-data-circle';
import { calculatePoints } from '../utils/data-projection';
import { buildCartesianVector } from '../utils/vector';
import useD3ColorScale from './useD3ColorScale';

function useD3ArrowDrag(setVectors, svgRef, points, vectors, dataMatrix) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;

	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);

	const { selectColor } = useD3ColorScale(selectedClassColumn);

	const currentPoints = useRef(points);
	const currentVectors = useRef(vectors);
	const currentDataMatrix = useRef(dataMatrix);

	useEffect(() => {
		currentVectors.current = vectors;
		currentDataMatrix.current = dataMatrix;
		currentPoints.current = points;
	}, [vectors, dataMatrix, points]);

	useEffect(() => {
		const svg = select(svgRef.current);
		svg.selectAll('.arrow-head').call((arrowHead) =>
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
						});
					})
					.on('end', () => {
						svg.style('cursor', 'move');
						arrowHead.style('cursor', 'grab');
						setVectors(currentVectors.current);
					})
			)
		);
	}, [
		setVectors,
		selectColor,
		svgRef,
		originalData,
		selectedClassColumn,
		unitCircleRadius,
		arrowHeadScale,
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
					selectColor,
					selectedClassColumn
				);
			},
			(update) => {
				updateDataCircle(
					update,
					unitCircleRadius,
					selectColor,
					selectedClassColumn
				);
			},
			exitDataCircle
		);
}

export default useD3ArrowDrag;
