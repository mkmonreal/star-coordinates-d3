import { line } from 'd3';
import {
	calculateArrowheadRotation,
	getArrowbodyPath,
	getArrowheadPath,
} from './arrow-geometry';

const lineGenerator = line();

export function enterArrows(enter, unitCircleRadius, arrowHeadScale) {
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

export function updateArrows(update, unitCircleRadius, arrowHeadScale) {
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
}

export function exitArrows(exit) {
	exit.remove();
}
