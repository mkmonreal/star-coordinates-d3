import PropTypes from 'prop-types';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useConfigStore from '../stores/config-store';
import useDataMatrix from '../hooks/useDataMatrix';
import useInitialVectors from '../hooks/useInitialVectors';
import StarCoordinates from './StarCoordinates';
import createColormap from 'colormap';
import { scaleQuantize } from 'd3';
import { useEffect, useState } from 'react';

function StarCoordinatesWrapper({ height, width }) {
	const colorScale = scaleQuantize()
		.domain([0, 5])
		.range(createColormap({ colormap: 'viridis' }));

	const normalizationMethod = useConfigStore(
		(state) => state.normalizationMethod
	);

	const setUnitCircleRadius = useConfigStore(
		(state) => state.setUnitCircleRadius
	);

	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);

	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);

	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const numArrows = useConfigStore((state) => state.numArrows);

	const analysis = useConfigStore((state) => state.analysis);

	const { dataMatrix, columnsDictionary } = useDataMatrix(
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows,
		selectedClassColumn
	);

	const initialVectors = useInitialVectors(
		columnsDictionary,
		analysis,
		numArrows
	);

	const [vectors, setVectors] = useState();

	const handleVectorUpdate = (newVectors) => {
		setVectors(newVectors);
	};

	useEffect(() => {
		setUnitCircleRadius(height > width ? width / 5 : height / 5);
	}, [setUnitCircleRadius, width, height]);

	useEffect(() => {
		setVectors(initialVectors);
	}, [initialVectors]);

	return (
		vectors && (
			<StarCoordinates
				width={width}
				height={height}
				vectors={vectors}
				onVectorUpdate={handleVectorUpdate}
				dataMatrix={dataMatrix}
			/>
		)
	);
}

StarCoordinatesWrapper.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default StarCoordinatesWrapper;
