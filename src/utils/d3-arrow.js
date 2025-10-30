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
