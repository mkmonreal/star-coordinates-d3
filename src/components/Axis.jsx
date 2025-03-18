import { line } from 'd3';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useDrag from '../hooks/useDrag';
import { buildCartesianVector } from '../utils/vector';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import useConfigStore from '../stores/config-store';
import { sin } from 'mathjs';
import { unit } from 'mathjs';
import { tan } from 'mathjs';
import { mod } from 'mathjs';

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

	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);

	const [vec, setVec] = useState(vector);

	const arrowheadRef = useRef();

	const x = unitCircleRadius * vec.cartesian.x;
	const y = unitCircleRadius * -vec.cartesian.y;

	useDrag(arrowheadRef, (e) => {
		setVec((prevVec) => {
			const x = prevVec.cartesian.x + e.dx / unitCircleRadius;
			const y = prevVec.cartesian.y - e.dy / unitCircleRadius;
			const newVec = buildCartesianVector(x, y, prevVec.lable, prevVec.id);
			updateVector(newVec);
			return newVec;
		});
	});

	return (
		<g>
			<path d={lineGenerator(getPath({ x, y }))} stroke="gray" />
			<path
				ref={arrowheadRef}
				d={lineGenerator(getArrowheadPath({ x, y }))}
				stroke="gray"
				fill="gray"
				transform={`rotate(${mod(360 - vec.polar.angle, 360)}, ${x}, ${y})`}
			/>
		</g>
	);
}

export default Axis;
