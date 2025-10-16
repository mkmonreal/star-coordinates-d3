import { line, select } from 'd3';
import { mod } from 'mathjs';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';

const lineGenerator = line();

function useD3ArrowRender(svgRef, vectors) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}
		if (!vectors) {
			return;
		}

		select(svgRef.current)
			.select('.arrows')
			.selectAll('.arrow')
			.data(vectors, (vector) => vector.label)
			.join(
				(enter) => enterArrows(enter, unitCircleRadius, arrowHeadScale),
				(update) => updateArrows(update, unitCircleRadius, arrowHeadScale),
				exitArrows
			);
	}, [svgRef, vectors, unitCircleRadius, arrowHeadScale]);
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

function enterArrows(enter, unitCircleRadius, arrowHeadScale) {
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
				);
		});
}

function updateArrows(update, unitCircleRadius, arrowHeadScale) {
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

export default useD3ArrowRender;
