import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import { enterArrows, exitArrows, updateArrows } from '../utils/d3-arrow';

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

export default useD3ArrowRender;
