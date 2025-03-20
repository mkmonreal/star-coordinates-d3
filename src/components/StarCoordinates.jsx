import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';
import useConfigStore from '../stores/config-store';
import { buildPolarVector } from '../utils/vector';
import { useEffect } from 'react';

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

function StarCoordinates({ height, width }) {
	const normalizedData = useStarCoordinatesStore(
		(state) => state.normalizedData
	);
	const selectedHeaders = useStarCoordinatesStore(
		(state) => state.selectedHeaders
	);

	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const fill = useConfigStore((state) => state.fill);
	const stroke = useConfigStore((state) => state.stroke);
	const idColumn = useConfigStore((state) => state.idColumn);

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

	const [vectors, setVectors] = useState();

	useEffect(() => {
		setVectors(createVectors(selectedHeaders));
	}, [selectedHeaders]);

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
						key={`${vector.id}_${vectors.length}`}
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
				{normalizedData &&
					normalizedData.map((value) => (
						<DataCircle
							key={value[idColumn]}
							dataRow={value}
							radius={4}
							stroke={stroke}
							fill={fill}
							unitCircleRadius={unitCircleRadius}
							vectors={vectors}
						/>
					))}
			</g>
		</svg>
	);
}

export default StarCoordinates;
