import { drag, line, select } from 'd3';
import { matrix, mod, multiply } from 'mathjs';
import { useEffect, useRef } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { buildCartesianVector } from '../utils/vector';
import useD3ColorScale from './useD3ColorScale';

const lineGenerator = line();

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
						dragHandler(
							e,
							svg,
							selectColor,
							currentVectors,
							currentDataMatrix,
							currentPoints,
							originalData,
							selectedClassColumn,
							unitCircleRadius,
							arrowHeadScale
						);
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

function dragHandler(
	e,
	svg,
	selectColor,
	currentVectors,
	currentDataMatrix,
	currentPoints,
	originalData,
	selectedClassColumn,
	unitCircleRadius,
	arrowHeadScale
) {
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
			(enter) => {},
			(update) => {
				update.call((arrow) => {
					arrow
						.select('.arrow-head')
						.attr('d', (d) =>
							lineGenerator(
								getArrowheadPath(
									{
										x: d.cartesian.x * unitCircleRadius,
										y: d.cartesian.y * unitCircleRadius,
									},
									arrowHeadScale
								)
							)
						)
						.attr(
							'transform',
							(d) =>
								`rotate(${calculateArrowheadRotation(d.cartesian.x, d.cartesian.y, d.polar.angle, unitCircleRadius)})`
						);

					arrow
						.select('.arrow-body')
						.attr('d', (d) =>
							lineGenerator(
								getArrowbodyPath(d.cartesian.x, d.cartesian.y, unitCircleRadius)
							)
						);
				});
			},
			(exit) => {}
		);

	svg
		.selectAll('.data-circle')
		.data(currentPoints.current, (point) => `${point.id}`)
		.join(
			(enter) => {
				enter
					.append('circle')
					.classed('data-circle', true)
					.attr('cx', (d) => d.x * unitCircleRadius)
					.attr('cy', (d) => -d.y * unitCircleRadius)
					.attr('r', 4)
					.attr('stroke', 'black')
					.attr('fill', (d) => {
						if (!selectColor) {
							return 'orange';
						}
						const fill = selectColor(d.originalValue[selectedClassColumn]);
						return fill || 'orange';
					});
			},
			(update) => {
				update
					.attr('cx', (d) => d.x * unitCircleRadius)
					.attr('cy', (d) => -d.y * unitCircleRadius);
			},
			(exit) => {
				exit.remove();
			}
		);
}

function getArrowheadPath({ x, y }, ratio = 1) {
	y = -y;
	return [
		[x - 15 * ratio, y],
		[x - 18 * ratio, y + 6 * ratio],
		[x, y],
		[x - 18 * ratio, y - 6 * ratio],
		[x - 15 * ratio, y],
	];
}

function getArrowbodyPath(x, y, unitCircleRadius = 1) {
	y = -y;
	return [
		[0, 0],
		[x * unitCircleRadius, y * unitCircleRadius],
	];
}

function calculateArrowheadRotation(x, y, angle, unitCircleRadius = 1) {
	y = -y;
	return `${mod(360 - angle, 360)} ${x * unitCircleRadius}, ${y * unitCircleRadius}`;
}

function calculatePoints(vectors, dataMatrix, originalData) {
	if (!vectors) {
		return [];
	}

	const vectorsMatrix = matrix(
		vectors.map((vector) => [vector.cartesian.x, vector.cartesian.y])
	);

	if (dataMatrix.size()[1] !== vectorsMatrix.size()[0]) {
		return [];
	}

	const dataPoints = multiply(dataMatrix, vectorsMatrix);
	const calculatedPoints = dataPoints.toArray().map((d, i) => {
		return { id: i, x: d[0], y: d[1], originalValue: originalData[i] };
	});

	return calculatedPoints;
}

export default useD3ArrowDrag;
