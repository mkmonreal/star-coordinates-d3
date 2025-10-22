import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import {
	enterDataCircle,
	exitDataCircle,
	updateDataCircle,
} from '../utils/d3-data-circle';
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

export default useD3DataCircleRender;
