import { matrix, multiply } from 'mathjs';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useD3ArrowDrag from '../hooks/useD3ArrowDrag';
import useD3ArrowRender from '../hooks/useD3ArrowRender';
import useD3DataCircleRender from '../hooks/useD3DataCircleRender';
import useD3SVGSetup from '../hooks/useD3SVGSetup';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

function StarCoordinates({
	width,
	height,
	vectors,
	onVectorUpdate,
	dataMatrix,
}) {
	console.log('render');
	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const points = useMemo(() => {
		return calculatePoints(vectors, dataMatrix, originalData);
	}, [vectors, dataMatrix, originalData]);

	const svgRef = useD3SVGSetup(width, height);

	useD3ArrowRender(svgRef, vectors);
	useD3DataCircleRender(svgRef, points);
	useD3ArrowDrag(onVectorUpdate, svgRef, points, vectors, dataMatrix);

	return <svg className="star-coordinates" ref={svgRef}></svg>;
}

function calculatePoints(vectors, dataMatrix, originalData) {
	if (!vectors) {
		return [];
	}

	const vectorsMatrix = matrix(
		vectors.map((vector) => [vector.cartesian.x, vector.cartesian.y])
	);

	if (dataMatrix.size()[1] !== vectorsMatrix.size()[0]) {
		return [];
	}

	const dataPoints = multiply(dataMatrix, vectorsMatrix);
	const calculatedPoints = dataPoints.toArray().map((d, i) => {
		return { id: i, x: d[0], y: d[1], originalValue: originalData[i] };
	});

	return calculatedPoints;
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	vectors: PropTypes.array.isRequired,
	onVectorUpdate: PropTypes.func.isRequired,
	dataMatrix: PropTypes.object.isRequired,
};

export default StarCoordinates;
