import PropTypes from 'prop-types';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import { useEffect, useState } from 'react';
import useDataProjection from '../hooks/useDataProjection';
import useInitialVectors from '../hooks/useInitialVectors';
import useConfigStore from '../stores/config-store';
import StarCoordinates from './StarCoordinates';

function StarCoordinatesWrapper({ height, width }) {
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

	const { dataMatrix, columnsIndexMap } = useDataProjection(
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows,
		selectedClassColumn
	);

	const initialVectors = useInitialVectors(
		columnsIndexMap,
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
