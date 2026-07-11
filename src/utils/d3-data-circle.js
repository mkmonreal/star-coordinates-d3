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

export function enterDataCircle(
	enter,
	unitCircleRadius,
	radius,
	opacity,
	selectColor,
	selectedClassColumn,
	selectedPointIds
) {
	enter
		.append('circle')
		.classed('data-circle', true)
		.attr('cx', (d) => d.x * unitCircleRadius)
		.attr('cy', (d) => -d.y * unitCircleRadius)
		.attr('r', radius)
		.attr('stroke', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return 'black';
			}
			return selectedPointIds.has(d.id) ? 'black' : 'none';
		})
		.attr('stroke-width', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return 1;
			}
			return selectedPointIds.has(d.id) ? 2 : 1;
		})
		.attr('fill', (d) => {
			if (!selectColor) {
				return 'orange';
			}
			const fill = selectColor(d.originalValue[selectedClassColumn]);
			return fill || 'orange';
		})
		.style('opacity', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return opacity;
			}
			return selectedPointIds.has(d.id) ? 0.65 : 0.55;
		});
}

export function updateDataCircle(
	update,
	unitCircleRadius,
	selectColor,
	selectedClassColumn,
	selectedPointIds,
	opacity
) {
	update
		.attr('cx', (d) => d.x * unitCircleRadius)
		.attr('cy', (d) => -d.y * unitCircleRadius)
		.attr('stroke', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return 'black';
			}
			return selectedPointIds.has(d.id) ? 'black' : 'none';
		})
		.attr('stroke-width', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return 1;
			}
			return selectedPointIds.has(d.id) ? 2 : 1;
		})
		.attr('fill', (d) => {
			if (!selectColor) {
				return 'orange';
			}
			const fill = selectColor(d.originalValue[selectedClassColumn]);
			return fill || 'orange';
		})
		.style('opacity', (d) => {
			if (!selectedPointIds || selectedPointIds.size === 0) {
				return opacity;
			}
			return selectedPointIds.has(d.id) ? 0.65 : 0.55;
		});
}

export function exitDataCircle(exit) {
	exit.remove();
}
