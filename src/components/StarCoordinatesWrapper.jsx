import PropTypes from 'prop-types';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useConfigStore from '../stores/config-store';
import useDataMatrix from '../hooks/useDataMatrix';
import useVectors from '../hooks/useVectors';
import StarCoordinates from './StarCoordinates';

function StarCoordinatesWrapper({ height, width }) {
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

	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const numArrows = useConfigStore((state) => state.numArrows);

	const analysis = useConfigStore((state) => state.analysis);

	const { dataMatrix, columnsDictionary } = useDataMatrix(
		originalData,
		selectedColumns,
		normalizationMethod,
		analysis,
		numArrows
	);

	const [vectors, setVectors] = useVectors(columnsDictionary);

	const handleVectorUpdate = (newVectors) => {
		setVectors(newVectors);
	};

	return (
		<StarCoordinates
			width={width}
			height={height}
			vectors={vectors}
			onVectorUpdate={handleVectorUpdate}
			dataMatrix={dataMatrix}
		/>
	);
}

StarCoordinatesWrapper.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default StarCoordinatesWrapper;
