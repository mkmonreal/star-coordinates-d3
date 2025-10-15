import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

function useD3DataCircleRender(svgRef, points) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const colorClassColumns = useConfigStore((state) => state.colorClassColumns);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	useEffect(() => {
		if (!points) {
			return;
		}

		const svg = select(svgRef.current);

		svg
			.select('.data-circles')
			.selectAll('.data-circle')
			.data(points, (point) => `${point.id}`)
			.join(
				(enter) =>
					enterDataCircle(
						enter,
						unitCircleRadius,
						colorClassColumns,
						selectedClassColumn
					),
				(update) =>
					updateDataCircle(
						update,
						unitCircleRadius,
						colorClassColumns,
						selectedClassColumn
					),
				exitDataCircle
			);
	}, [
		svgRef,
		points,
		unitCircleRadius,
		colorClassColumns,
		selectedClassColumn,
	]);
}

function enterDataCircle(
	enter,
	unitCircleRadius,
	colorClassColumns,
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
			if (!colorClassColumns) {
				return 'orange';
			}
			const fill = colorClassColumns.get(d.originalValue[selectedClassColumn]);
			return fill || 'orange';
		});
}

function updateDataCircle(
	update,
	unitCircleRadius,
	colorClassColumns,
	selectedClassColumn
) {
	update
		.attr('cx', (d) => d.x * unitCircleRadius)
		.attr('cy', (d) => -d.y * unitCircleRadius)
		.attr('fill', (d) => {
			if (!colorClassColumns) {
				return 'red';
			}
			const fill = colorClassColumns.get(d.originalValue[selectedClassColumn]);
			return fill || 'orange';
		});
}

function exitDataCircle(exit) {
	exit.remove();
}

export default useD3DataCircleRender;
