//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import PropTypes from 'prop-types';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import { useEffect } from 'react';
import useClassesIndexMap from '../hooks/useClassesIndexMap';
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
		normalizationMethod,
		originalData,
		selectedColumns
	);

	const classesIndexMap = useClassesIndexMap(
		analysis,
		originalData,
		selectedClassColumn
	);

	const [vectors, setVectors] = useVectors(
		columnsIndexMap,
		analysis,
		dataMatrix,
		classesIndexMap
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
