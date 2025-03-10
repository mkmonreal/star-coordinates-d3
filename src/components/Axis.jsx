import { line } from 'd3';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useDrag from '../hooks/useDrag';
import { buildCartesianVector } from '../utils/vector';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

const lineGenerator = line();

const getArrowheadPath = ({ x, y }) => [
	[x - 15, y],
	[x - 18, y + 6],
	[x, y],
	[x - 18, y - 6],
	[x - 15, y],
];

const getPath = ({ x, y }) => [
	[0, 0],
	[x, y],
];

function Axis({ vector }) {
	const updateVector = useStarCoordinatesStore((state) => state.updateVector);

	const [vec, setVec] = useState(vector);

	const arrowheadRef = useRef();

	useDrag(arrowheadRef, (e) => {
		setVec((prevVec) => {
			const x = prevVec.cartesian.x + e.dx;
			const y = prevVec.cartesian.y - e.dy;
			const newVec = buildCartesianVector(x, y, prevVec.lable, prevVec.id);
			updateVector(newVec);
			return newVec;
		});
	});

	return (
		<g>
			<path
				d={lineGenerator(getPath({ x: vec.cartesian.x, y: -vec.cartesian.y }))}
				stroke="gray"
			/>
			<path
				ref={arrowheadRef}
				d={lineGenerator(getArrowheadPath({ x: vec.cartesian.x, y: -vec.cartesian.y }))}
				stroke="gray"
				fill="gray"
				transform={`rotate(${-vec.polar.angle}, ${vec.cartesian.x}, ${-vec.cartesian.y})`}
			/>
		</g>
	);
}

export default Axis;
