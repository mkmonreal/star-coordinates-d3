import PropTypes from 'prop-types';
import { useRef, useState, useMemo, useEffect } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';
import useConfigStore from '../stores/config-store';
import { buildCartesianVector, buildPolarVector } from '../utils/vector';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import useNormalizedMatrix from '../hooks/useNormalizedMatrix';
import useMatrix from '../hooks/useMatrix';
import { pca } from '../js/pca';

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
	const [vectors, setVectors] = useState();
	useCreateVectorsFromSelectedColumns(setVectors, selectedColumns);

	const columnsDict = useMemo(() => {
		const columnsDict = selectedColumns.reduce((map, column, index) => {
			map.set(column, index);
			return map;
		}, new Map());
		return columnsDict;
	}, [selectedColumns]);

	const matrixData = useMatrix(originalData, selectedColumns);
	const normalizedMatrix = useNormalizedMatrix(matrixData, normalizationMethod);

	const svgRef = useRef();
	useDrag(svgRef, (event) => {
		setMinX((prevMinX) => prevMinX - event.dx);
		setMinY((prevMinY) => prevMinY - event.dy);
	});

	const analysis = useConfigStore((state) => state.analysis);
	const setAnalysis = useConfigStore((state) => state.setAnalysis);
	useEffect(() => {
		if (DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis) {
			const { principalComponents } = pca(matrixData);
			const [pc1, pc2] = principalComponents.map((pc) => pc.vector.toArray());

			const newVectors = selectedColumns.map((column, _, columns) => {
				const index = columnsDict.get(column);
				const x = pc1[index];
				const y = pc2[index];
				const newVector = buildCartesianVector(
					x,
					y,
					column,
					`${column}_${columns.length}`
				);
				return newVector;
			});
			setVectors(newVectors);
		} else if (
			DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
		) {
			console.log('LDA');
		}
	}, [analysis, setAnalysis, matrixData, selectedColumns, columnsDict]);

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
			<g>
				{vectors?.map((vector) => (
					<Axis
						key={`${analysis}_${vector.id}`}
						vector={vector}
						unitCircleRadius={unitCircleRadius}
						updateVector={(newVector) => {
							if (
								DimensionalityReductionStatisticalTechniquesEnum.NONE !==
								analysis
							) {
								setAnalysis(
									DimensionalityReductionStatisticalTechniquesEnum.NONE
								);
							}
							setVectors((prev) =>
								prev.map((vec) => (vec.id === newVector.id ? newVector : vec))
							);
						}}
					/>
				))}
			</g>
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

function useCreateVectorsFromSelectedColumns(setVectors, selectedColumns) {
	useEffect(() => {
		setVectors(createVectors(selectedColumns));
	}, [setVectors, selectedColumns]);
}

function createVectors(columns) {
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
}

export default StarCoordinates;
