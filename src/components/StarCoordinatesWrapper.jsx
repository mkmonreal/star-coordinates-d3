import PropTypes from 'prop-types';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import { useEffect } from 'react';
import useDataProjection from '../hooks/useDataProjection';
import useVectors from '../hooks/useVectors';
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

	const analysis = useConfigStore((state) => state.analysis);

	const { dataMatrix, columnsIndexMap } = useDataProjection(
		originalData,
		selectedColumns,
		normalizationMethod
	);

	const [vectors, setVectors] = useVectors(
		columnsIndexMap,
		analysis,
		dataMatrix
	);

	useEffect(() => {
		setUnitCircleRadius(height > width ? width / 5 : height / 5);
	}, [setUnitCircleRadius, width, height]);

	return (
		vectors && (
			<StarCoordinates
				width={width}
				height={height}
				vectors={vectors}
				onVectorUpdate={setVectors}
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
