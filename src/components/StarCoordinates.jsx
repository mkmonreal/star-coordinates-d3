import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import useConfigStore from '../stores/config-store';
import { mod } from 'mathjs';

const lineGenerator = d3.line();

function StarCoordinates({ width, height, vectors }) {
	const svgRef = useRef();
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;

	useEffect(() => {
		const svg = d3.select(svgRef.current);

		svg.selectAll('*').remove();

		svg
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`);

		svg
			.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', unitCircleRadius)
			.attr('stroke', 'grey')
			.attr('fill', 'none');

		svg.append('g').classed('arrows', true);
		svg.append('g').classed('data-circles', true);
	}, [width, height, unitCircleRadius]);

	useEffect(() => {
		if (!vectors) {
			return;
		}

		const svg = d3.select(svgRef.current);

		const arrowsGroup = svg.select('.arrows');
		const arrows = arrowsGroup
			.selectAll('.arrow')
			.data(vectors, (vector) => vector.label);
		const arrowsEnter = arrows.enter();

		const arrowEnter = arrowsEnter.append('g').classed('arrow', true);
		arrowEnter
			.append('path')
			.classed('arrow-body', true)
			.attr('d', (d) => {
				const path = [[0, 0]];
				path.push([
					d.cartesian.x * unitCircleRadius,
					-d.cartesian.y * unitCircleRadius,
				]);

				return lineGenerator(path);
			})
			.attr('stroke', 'grey');

		arrowEnter
			.append('path')
			.classed('arrow-head', true)
			.attr('d', (d) => {
				const path = getArrowheadPath(
					{
						x: d.cartesian.x * unitCircleRadius,
						y: -d.cartesian.y * unitCircleRadius,
					},
					arrowHeadScale
				);
				return lineGenerator(path);
			})
			.attr('stroke', 'grey')
			.attr('fill', 'grey')
			.attr(
				'transform',
				(d) =>
					`rotate(${getArrowRotation(d.cartesian.x, d.cartesian.y, d.polar.angle, unitCircleRadius)})`
			);
	}, [unitCircleRadius, arrowHeadScale, vectors]);

	return <svg ref={svgRef}></svg>;
}

function getArrowheadPath({ x, y }, ratio = 1) {
	return [
		[x - 15 * ratio, y],
		[x - 18 * ratio, y + 6 * ratio],
		[x, y],
		[x - 18 * ratio, y - 6 * ratio],
		[x - 15 * ratio, y],
	];
}

function getArrowRotation(x, y, angle, unitCircleRadius = 1) {
	return `${mod(360 - angle, 360)} ${x * unitCircleRadius} ${-y * unitCircleRadius}`;
}

export default StarCoordinates;
