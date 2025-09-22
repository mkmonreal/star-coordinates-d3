import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import useConfigStore from '../stores/config-store';
import useDataMatrix from '../hooks/useDataMatrix';
import useVectors from '../hooks/useVectors';
import StarCoordinates from './StarCoordinates';

function StarCoordinatesWrapper({ height, width }) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const fill = useConfigStore((state) => state.fill);
	const stroke = useConfigStore((state) => state.stroke);

	const normalizationMethod = useConfigStore(
		(state) => state.normalizationMethod
	);

	const setUnitCircleRadius = useConfigStore(
		(state) => state.setUnitCircleRadius
	);

	if (height > width) {
		setUnitCircleRadius(width / 5);
	} else {
		setUnitCircleRadius(height / 5);
	}

	const centerX = width / 2;
	const centerY = height / 2;

	const [minX, setMinX] = useState(-centerX);
	const [minY, setMinY] = useState(-centerY);

	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const numArrows = useConfigStore((state) => state.numArrows);

	const svgRef = useRef();
	useDrag(svgRef, (event) => {
		setMinX((prevMinX) => prevMinX - event.dx);
		setMinY((prevMinY) => prevMinY - event.dy);
	});

	const analysis = useConfigStore((state) => state.analysis);

	const { dataMatrix, columnsDictionary } = useDataMatrix(
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows
	);

	const [vectors, setVectors] = useState([]);
	useVectors(setVectors, columnsDictionary);

	return <StarCoordinates width={width} height={height} vectors={vectors} />;
}

StarCoordinatesWrapper.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default StarCoordinatesWrapper;
