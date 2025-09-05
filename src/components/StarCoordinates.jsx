import PropTypes from 'prop-types';
import { useRef, useState, useMemo, useEffect } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';
import useConfigStore from '../stores/config-store';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import useNormalizedMatrix from '../hooks/useNormalizedMatrix';
import useDataMatrix from '../hooks/useDataMatrix';
import { pca } from '../js/pca';
import { matrix, matrixFromColumns, multiply } from 'mathjs';
import useTransformedColumnsNames from '../hooks/useTransformedColumnsNames';
import useVectors from '../hooks/useVectors';

function StarCoordinates({ height, width }) {
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

	// const [vectors, setVectors] = useVectors(columnsDictionary);
	const [vectors, setVectors] = useState();
	useVectors(setVectors, columnsDictionary);

	return (
		<svg
			ref={svgRef}
			height={height}
			width={width}
			viewBox={`${minX} ${minY} ${width} ${height}`}
		>
			<Circle
				cx={0}
				cy={0}
				radius={unitCircleRadius}
				stroke="grey"
				fill="none"
			/>
			{vectors?.map((vector) => (
				<g>
					<Axis
						key={`${analysis}_${vector.id}`}
						vector={vector}
						unitCircleRadius={unitCircleRadius}
						updateVector={(newVector) => {
							setVectors((prev) =>
								prev.map((vec) => (vec.id === newVector.id ? newVector : vec))
							);
						}}
					/>
				</g>
			))}
			{dataMatrix?.toArray().map((value, index) => (
				<g>
					<DataCircle
						key={index}
						matrixRow={value}
						radius={(3 * unitCircleRadius) / 250}
						stroke={stroke}
						fill={fill}
						unitCircleRadius={unitCircleRadius}
						vectors={vectors}
						columnsDict={columnsDictionary}
					/>
				</g>
			))}
		</svg>
	);
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default StarCoordinates;
