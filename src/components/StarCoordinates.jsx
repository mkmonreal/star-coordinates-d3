import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useStarCoordinatesStore from '../stores/star-coorditantes-store';

import useDrag from '../hooks/useDrag';

import Axis from './Axis';
import Circle from './Circle';
import DataCircle from './DataCircle';

function StarCoordinates({ height, width }) {
	const vectors = useStarCoordinatesStore((state) => state.vectors);
	const headers = useStarCoordinatesStore((state) => state.headers);
	const originalData = useStarCoordinatesStore((state) => state.originalData);

	const centerX = width / 2;
	const centerY = height / 2;

	const [minX, setMinX] = useState(-centerX);
	const [minY, setMinY] = useState(-centerY);

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
				radius={150}
				stroke="grey"
				fill="none"
			/>
			{vectors && vectors.map((vector) => (
				<Axis
					key={vector.lable}
					vector={vector}
				/>
			))}

			<g>
				{originalData && originalData.map((value) => (
					<DataCircle
						key={value.id}
						dataRow={value}
						radius={4}
						stroke="salmon"
						fill="lightsalmon"
					/>
				))}
			</g>
		</svg>
	);
}

export default StarCoordinates;
