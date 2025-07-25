import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';
import useConfigStore from '../stores/config-store';
import { buildPolarVector } from '../utils/vector';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import useColumnsDictCreator from '../hooks/useColumnsDictCreator';
import useNormalicedMatrixCreator from '../hooks/useNormalicedMatrixCreator';
import useDataMatrixCreator from '../hooks/useDataMatrixCreator';
import useVectorsCreator from '../hooks/useVectorsCreator';
import useClassesMatrixexCreator from '../hooks/useClassesMatrixesCreator';

const createVectors = (columns) => {
	if (!columns || columns.length === 0) {
		return;
	}

	const vectors = [];
	const angleDiff = 360 / columns.length;

	for (const [index, validHeader] of columns.entries()) {
		const module = 1;
		const angle = index * angleDiff;
		const vector = buildPolarVector(
			module,
			angle,
			validHeader,
			`${validHeader}_${columns.length}_${DimensionalityReductionStatisticalTechniquesEnum.NONE}`
		);
		vectors.push(vector);
	}

	return vectors;
};

const normalizationMethodSelector = (method) => {
	switch (method) {
		case NormalizationMethodEnum.MIN_MAX:
			return normalizeData;
		case NormalizationMethodEnum.Z_SCORE:
			return standarizeData;
		default:
			return normalizeData;
	}
};

function StarCoordinates({ height, width }) {
	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const setClasses = useStarCoordinatesStore((state) => state.setClasses);

	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const fill = useConfigStore((state) => state.fill);
	const stroke = useConfigStore((state) => state.stroke);
	const idColumn = useConfigStore((state) => state.idColumn);
	const setUnitCircleRadius = useConfigStore(
		(state) => state.setUnitCircleRadius
	);
	const normalizationMethod = useConfigStore(
		(state) => state.normalizationMethod
	);
	const analysis = useConfigStore((state) => state.analysis);

	if (height > width) {
		setUnitCircleRadius(width / 5);
	} else {
		setUnitCircleRadius(height / 5);
	}

	const centerX = width / 2;
	const centerY = height / 2;

	const [minX, setMinX] = useState(-centerX);
	const [minY, setMinY] = useState(-centerY);

	const [vectors, setVectors] = useState();
	const [dataMatrix, setDataMatrix] = useState();
	const [normalizedMatrix, setNormalizedMatrix] = useState();
	const [columnsDict, setColumnsDict] = useState();
	const [classesMatrixesMap, setClassesMatrixesMap] = useState();

	useColumnsDictCreator(setColumnsDict, selectedColumns);

	useDataMatrixCreator(setDataMatrix, selectedColumns, originalData);

	useNormalicedMatrixCreator(
		setNormalizedMatrix,
		normalizationMethodSelector(normalizationMethod),
		dataMatrix
	);

	useClassesMatrixexCreator(
		setClassesMatrixesMap,
		setClasses,
		analysis,
		selectedClassColumn,
		selectedColumns,
		originalData
	);

	useVectorsCreator(
		createVectors,
		setVectors,
		analysis,
		columnsDict,
		dataMatrix,
		classesMatrixesMap
	);

	const svgRef = useRef();
	useDrag(svgRef, (event) => {
		setMinX((prevMinX) => prevMinX - event.dx);
		setMinY((prevMinY) => prevMinY - event.dy);
	});

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
				<Axis
					key={vector.id}
					vector={vector}
					unitCircleRadius={unitCircleRadius}
					updateVector={(newVector) =>
						setVectors((prev) =>
							prev.map((vec) => (vec.id === newVector.id ? newVector : vec))
						)
					}
				/>
			))}

			<g>
				{normalizedMatrix?.toArray().map((value, index) => (
					<DataCircle
						key={index}
						matrixRow={value}
						radius={(3 * unitCircleRadius) / 250}
						stroke={stroke}
						fill={fill}
						unitCircleRadius={unitCircleRadius}
						vectors={vectors}
						columnsDict={columnsDict}
					/>
				))}
			</g>
		</svg>
	);
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default StarCoordinates;
