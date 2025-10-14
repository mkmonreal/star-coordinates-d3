import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import useConfigStore from '../stores/config-store';
import { mod, matrix, multiply } from 'mathjs';
import { buildCartesianVector } from '../utils/vector';
import PropTypes from 'prop-types';
import createColormap from 'colormap';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

const lineGenerator = d3.line();

function StarCoordinates({
	width,
	height,
	vectors,
	onVectorUpdate,
	dataMatrix,
}) {
	const svgRef = useRef();
	const currentViewBox = useRef({ x: -width / 2, y: -height / 2 });
	const currentVectors = useRef(vectors);
	const currentDataMatrix = useRef(dataMatrix);
	const currentPoints = useRef([]);
	const currentNode = useRef(null);
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;

	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const colorClassColumns = useConfigStore((state) => state.colorClassColumns);
	const setColorClassColumns = useConfigStore(
		(state) => state.setColorClassColumns
	);
	const colorset = useConfigStore((state) => state.colorset);
	useEffect(() => {
		if (!selectedClassColumn) {
			return;
		}
		const classColumnsSet = new Set(
			originalData.map((d) => d[selectedClassColumn])
		);
		const colorScale = createColorScale(classColumnsSet.size - 1, colorset);
		setColorClassColumns(
			Array.from(classColumnsSet).reduce(
				(colorClassColumnsMap, classColumn, classColumnIndex) => {
					return colorClassColumnsMap.set(
						classColumn,
						colorScale(classColumnIndex)
					);
				},
				new Map()
			)
		);
	}, [setColorClassColumns, originalData, selectedClassColumn, colorset]);

	useEffect(() => {
		currentVectors.current = vectors;
		currentDataMatrix.current = dataMatrix;
		currentPoints.current = calculatePoints(
			currentVectors.current,
			currentDataMatrix.current,
			originalData
		);
	}, [vectors, dataMatrix, originalData]);

	useEffect(() => {
		const svg = d3.select(svgRef.current);

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
			d3.drag().on('drag', (e) => {
				const x = currentViewBox.current.x - e.dx;
				const y = currentViewBox.current.y - e.dy;
				currentViewBox.current = { x, y };
				svg.attr(
					'viewBox',
					`${currentViewBox.current.x} ${currentViewBox.current.y} ${width} ${height}`
				);
			})
		);

		return () => {
			// TODO: cleanup function
		};
	}, [width, height, unitCircleRadius]);

	useEffect(() => {
		if (!currentVectors.current) {
			return;
		}
		if (!currentDataMatrix.current) {
			return;
		}
		if (!currentPoints.current) {
			return;
		}

		const svg = d3.select(svgRef.current);

		svg
			.select('.arrows')
			.selectAll('.arrow')
			.data(currentVectors.current, (vector) => vector.label)
			.join(enterArrows, updateArrows, exitArrows);

		svg
			.select('.data-circles')
			.selectAll('.data-circle')
			.data(currentPoints.current, (d) => d.id)
			.join(enterDataCircle, updateDataCircle, exitDataCircle);

		function enterArrows(enter) {
			enter
				.append('g')
				.classed('arrow', true)
				.call((g) => {
					g.append('path')
						.classed('arrow-body', true)
						.attr('d', (d) =>
							lineGenerator(
								getArrowbodyPath(d.cartesian.x, d.cartesian.y, unitCircleRadius)
							)
						)
						.attr('stroke', 'gray');
					g.append('path')
						.classed('arrow-head', true)
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
						.attr('stroke', 'gray')
						.attr('fill', 'gray')
						.attr(
							'transform',
							(d) =>
								`rotate(${calculateArrowheadRotation(d.cartesian.x, d.cartesian.y, d.polar.angle, unitCircleRadius)})`
						)
						.call((path) => {
							path.call(
								d3
									.drag()
									.on('start', (e) => {
										currentNode.current = e.sourceEvent.target;
										svg.style('cursor', 'grabbing');
										path.style('cursor', 'grabbing');
									})
									.on('drag', handleOnDragArrowhead)
									.on('end', () => {
										currentNode.current = null;
										svg.style('cursor', 'move');
										path.style('cursor', 'grab');
										onVectorUpdate(currentVectors.current);
									})
							);
						});
				});
		}

		function updateArrows(update) {
			update.call((g) => {
				g.select('.arrow-body').attr('d', (d) =>
					lineGenerator(
						getArrowbodyPath(d.cartesian.x, d.cartesian.y, unitCircleRadius)
					)
				);
				g.select('.arrow-head')
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
			});
		}

		function exitArrows(exit) {
			exit.remove();
		}

		function enterDataCircle(enter) {
			console.log('enter date cilcle', enter);
			enter
				.append('circle')
				.classed('data-circle', true)
				.attr('cx', (d) => d.x * unitCircleRadius)
				.attr('cy', (d) => -d.y * unitCircleRadius)
				.attr('r', 4)
				.attr('stroke', 'white')
				.attr('fill', (d) => {
					if (!colorClassColumns) {
						return 'orange';
					}
					const fill = colorClassColumns.get(
						d.originalValue[selectedClassColumn]
					);
					return fill || 'orange';
				});
		}

		function updateDataCircle(update) {
			console.log('update date circle', update);
			update
				.attr('cx', (d) => d.x * unitCircleRadius)
				.attr('cy', (d) => -d.y * unitCircleRadius)
				.attr('fill', (d) => {
					if (!colorClassColumns) {
						return 'red';
					}
					const fill = colorClassColumns.get(
						d.originalValue[selectedClassColumn]
					);
					return fill || 'orange';
				});
		}

		function exitDataCircle(exit) {
			exit.remove();
		}

		function handleOnDragArrowhead(e, d) {
			const currentVector = currentVectors.current.find(
				(vector) => d.label === vector.label
			);

			const newVector = buildCartesianVector(
				currentVector.cartesian.x + e.dx / unitCircleRadius,
				currentVector.cartesian.y - e.dy / unitCircleRadius,
				currentVector.label
			);
			currentVectors.current = currentVectors.current.map((vector) =>
				newVector.label === vector.label ? newVector : vector
			);

			updateArrowPosition(
				d3.select(currentNode.current),
				newVector.cartesian.x,
				newVector.cartesian.y,
				newVector.polar.angle
			);

			const dataPoints = calculatePoints(
				currentVectors.current,
				currentDataMatrix.current,
				originalData
			);

			svg
				.select('.data-circles')
				.selectAll('.data-circle')
				.data(dataPoints, (d) => d.id)
				.join(enterDataCircle, updateDataCircle, exitDataCircle);
		}

		function updateArrowPosition(selection, x, y, angle) {
			if (!selection.node()) {
				return;
			}

			selection
				.attr(
					'd',
					lineGenerator(
						getArrowheadPath(
							{
								x: x * unitCircleRadius,
								y: y * unitCircleRadius,
							},
							arrowHeadScale
						)
					)
				)
				.attr(
					'transform',
					`rotate(${calculateArrowheadRotation(x, y, angle, unitCircleRadius)})`
				);
			d3.select(selection.node().parentNode)
				.select('.arrow-body')
				.attr('d', lineGenerator(getArrowbodyPath(x, y, unitCircleRadius)));

			return () => {
				// TODO: cleanup function
			};
		}
	}, [
		unitCircleRadius,
		arrowHeadScale,
		vectors,
		onVectorUpdate,
		dataMatrix,
		originalData,
		selectedClassColumn,
		colorClassColumns,
	]);

	return <svg className="star-coordinates" ref={svgRef}></svg>;
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

function calculateArrowheadRotation(x, y, angle, unitCircleRadius = 1) {
	y = -y;
	return `${mod(360 - angle, 360)} ${x * unitCircleRadius}, ${y * unitCircleRadius}`;
}

function getArrowbodyPath(x, y, unitCircleRadius = 1) {
	y = -y;
	return [
		[0, 0],
		[x * unitCircleRadius, y * unitCircleRadius],
	];
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

function createColorScale(maxDomain, colormap) {
	const colorScale = d3
		.scaleQuantize()
		.domain([0, maxDomain])
		.range(createColormap({ colormap }));

	return colorScale;
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	vectors: PropTypes.array.isRequired,
	onVectorUpdate: PropTypes.func.isRequired,
	dataMatrix: PropTypes.object.isRequired,
};

export default StarCoordinates;
