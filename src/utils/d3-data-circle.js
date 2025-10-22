export function enterDataCircle(
	enter,
	unitCircleRadius,
	selectColor,
	selectedClassColumn
) {
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
}

export function updateDataCircle(
	update,
	unitCircleRadius,
	selectColor,
	selectedClassColumn
) {
	update
		.attr('cx', (d) => d.x * unitCircleRadius)
		.attr('cy', (d) => -d.y * unitCircleRadius)
		.attr('fill', (d) => {
			if (!selectColor) {
				return 'orange';
			}
			const fill = selectColor(d.originalValue[selectedClassColumn]);
			return fill || 'orange';
		});
}

export function exitDataCircle(exit) {
	exit.remove();
}
