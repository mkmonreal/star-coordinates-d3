import { useEffect, useRef } from 'react';
import { select, drag } from 'd3';
import useConfigStore from '../stores/config-store';

function useD3SVGSetup(width, height) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const svgRef = useRef();
	const currentViewBox = useRef({ x: -width / 2, y: -height / 2 });

	useEffect(() => {
		const svg = select(svgRef.current);

		svg.selectAll('*').remove();

		svg
			.attr('width', width)
			.attr('height', height)
			.attr(
				'viewBox',
				`${currentViewBox.current.x} ${currentViewBox.current.y} ${width} ${height}`
			);

		svg
			.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', unitCircleRadius)
			.attr('stroke', 'grey')
			.attr('fill', 'none');

		svg.append('g').classed('arrows', true);
		svg.append('g').classed('data-circles', true);

		svg.call(
			drag().on('drag', (e) => {
				const x = currentViewBox.current.x - e.dx;
				const y = currentViewBox.current.y - e.dy;
				currentViewBox.current = { x, y };
				svg.attr(
					'viewBox',
					`${currentViewBox.current.x} ${currentViewBox.current.y} ${width} ${height}`
				);
			})
		);

		return () => {
			svg.on('.drag', null);
		};
	}, [width, height, unitCircleRadius]);

	return svgRef;
}

export default useD3SVGSetup;
