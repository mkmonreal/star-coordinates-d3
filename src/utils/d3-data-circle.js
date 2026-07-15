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
