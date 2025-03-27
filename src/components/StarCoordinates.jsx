import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';
import useConfigStore from '../stores/config-store';
import { buildCartesianVector, buildPolarVector } from '../utils/vector';
import { useEffect } from 'react';
import { matrix, matrixFromColumns } from 'mathjs';
import normalizeData from '../js/data/normalize';
import standarizeData from '../js/data/standarize';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { pca } from '../js/pca';
import { multiply } from 'mathjs';
import { row } from 'mathjs';

const createVectors = (headers) => {
	if (!headers || headers.length === 0) {
		return;
	}

	const vectors = [];
	const angleDiff = 360 / headers.length;

	for (const [index, validHeader] of headers.entries()) {
		const module = 1;
		const angle = index * angleDiff;
		const vector = buildPolarVector(module, angle, validHeader, validHeader);
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

	useEffect(() => {
		if (!selectedColumns || selectedColumns.length === 0) {
			return;
		}
		let newVectors = [];

		if (DimensionalityReductionStatisticalTechniquesEnum.NONE === analysis) {
			newVectors = createVectors(selectedColumns);
		} else if (
			DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis
		) {
			const { principalComponents } = pca(dataMatrix);
			const [pc1, pc2] = principalComponents;
			const newVectorsMatrix = matrix(
				matrixFromColumns(pc1.vector, pc2.vector)
			);
			newVectors = vectors.map((vector) => {
				const index = columnsDict[vector.label];
				const vectorMatrix = row(newVectorsMatrix, index);
				const [x, y] = vectorMatrix.toArray()[0];
				const newVector = buildCartesianVector(x, y, vector.label, vector.id);
				return newVector;
			});
		}

		setVectors(newVectors);
	}, [analysis, selectedColumns, columnsDict, dataMatrix]);

	useEffect(() => {
		const newDataMatrix = matrix(
			matrixFromColumns(
				...selectedColumns.map((column) =>
					originalData.map((d) => parseFloat(d[column]))
				)
			)
		);
		setDataMatrix(newDataMatrix);
	}, [selectedColumns, originalData]);

	useEffect(() => {
		const normalizationMethodFunction =
			normalizationMethodSelector(normalizationMethod);

		setNormalizedMatrix(normalizationMethodFunction(dataMatrix));
	}, [normalizationMethod, dataMatrix]);

	useEffect(() => {
		if (!selectedColumns || selectedColumns.length === 0) {
			return;
		}

		const columnsDict = selectedColumns.reduce((acc, column, index) => {
			acc[column] = index;
			return acc;
		}, {});
		setColumnsDict(columnsDict);
	}, [selectedColumns]);

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
			{vectors &&
				vectors.map((vector) => (
					<Axis
						key={`${vector.id}_${vectors.length}_${analysis}`}
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
				{normalizedMatrix &&
					normalizedMatrix
						.toArray()
						.map((value, index) => (
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

export default StarCoordinates;
