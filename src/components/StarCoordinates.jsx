import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useD3ArrowDrag from '../hooks/useD3ArrowDrag';
import useD3ArrowRender from '../hooks/useD3ArrowRender';
import useD3DataCircleRender from '../hooks/useD3DataCircleRender';
import useD3SVGSetup from '../hooks/useD3SVGSetup';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { calculatePoints } from '../utils/data-projection';

function StarCoordinates({
	width,
	height,
	vectors,
	onVectorUpdate,
	dataMatrix,
}) {
	const svgRef = useD3SVGSetup(width, height);

	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const points = useMemo(() => {
		return calculatePoints(vectors, dataMatrix, originalData);
	}, [vectors, dataMatrix, originalData]);

	useD3ArrowRender(svgRef, vectors);
	useD3DataCircleRender(svgRef, points);
	useD3ArrowDrag(onVectorUpdate, svgRef, points, vectors, dataMatrix);

	return <svg className="star-coordinates" ref={svgRef}></svg>;
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	vectors: PropTypes.array.isRequired,
	onVectorUpdate: PropTypes.func.isRequired,
	dataMatrix: PropTypes.object.isRequired,
};

export default StarCoordinates;
