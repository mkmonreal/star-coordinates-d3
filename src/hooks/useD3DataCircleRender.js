import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import useD3ColorScale from './useD3ColorScale';

function useD3DataCircleRender(svgRef, points) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const { selectColor } = useD3ColorScale(selectedClassColumn);

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
						selectColor,
						selectedClassColumn
					),
				(update) =>
					updateDataCircle(
						update,
						unitCircleRadius,
						selectColor,
						selectedClassColumn
					),
				exitDataCircle
			);
	}, [svgRef, points, unitCircleRadius, selectColor, selectedClassColumn]);
}

function enterDataCircle(
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

function updateDataCircle(
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

function exitDataCircle(exit) {
	exit.remove();
}

export default useD3DataCircleRender;
