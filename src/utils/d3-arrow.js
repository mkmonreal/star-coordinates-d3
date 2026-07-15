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

import { line, select } from 'd3';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';
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

export function drawArrowLabel(
	svgSelection,
	vectors,
	unitCircleRadius,
	vectorVisualization
) {
	if (VectorNameVisualizationEnum.NONE.value === vectorVisualization.value) {
		svgSelection.selectAll('.arrow-text').remove();
	}

	if (VectorNameVisualizationEnum.ALWAYS.value === vectorVisualization.value) {
		svgSelection
			.select('.arrows')
			.select('.arrow')
			.selectAll('.arrow-text')
			.data(vectors, (vector) => vector.label)
			.join(
				(enter) => {
					appendArrowText(enter, unitCircleRadius);
				},
				(update) => {
					updateArrowTextPosition(update, unitCircleRadius);
				},
				(exit) => {
					exit.remove();
				}
			);
	}

	if (VectorNameVisualizationEnum.HOVER.value === vectorVisualization.value) {
		const currentCursor = svgSelection.style('cursor');
		if ('grabbing' !== currentCursor) {
			svgSelection.selectAll('.arrow-text').remove();
		}

		const arrow = svgSelection.select('.arrows').selectAll('.arrow');
		if (0 !== arrow.select('.arrow-text').nodes().length) {
			updateArrowTextPosition(arrow.select('.arrow-text'), unitCircleRadius);
		}
	}
}

export function appendArrowText(selection, unitCircleRadius) {
	selection
		.append('text')
		.classed('arrow-text', true)
		.attr('x', (d) => d.cartesian.x * unitCircleRadius)
		.attr('y', (d) => -d.cartesian.y * unitCircleRadius)
		.attr('dy', (d) => (0 > d.cartesian.y ? 12 : -12))
		.text((d) => d.label);
	return selection;
}

function updateArrowTextPosition(selection, unitCircleRadius) {
	selection
		.attr('x', (d) => d.cartesian.x * unitCircleRadius)
		.attr('y', (d) => -d.cartesian.y * unitCircleRadius)
		.attr('dy', (d) => (0 > d.cartesian.y ? 12 : -12));
	return selection;
}
