import { line } from 'd3';
import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useDrag from '../hooks/useDrag';
import { buildCartesianVector } from '../utils/vector';
import { mod } from 'mathjs';
import { Tooltip } from 'antd';

const lineGenerator = line();

const getArrowheadPath = ({ x, y }, ratio = 1) => [
	[x - 15 * ratio, y],
	[x - 18 * ratio, y + 6 * ratio],
	[x, y],
	[x - 18 * ratio, y - 6 * ratio],
	[x - 15 * ratio, y],
];

const getPath = ({ x, y }) => [
	[0, 0],
	[x, y],
];

function Axis({ vector, unitCircleRadius, updateVector }) {
	const arrowHeadScale = unitCircleRadius / 250;

	const [vectorState, setVectorState] = useState(vector);
	useEffect(() => {
		setVectorState(vector);
	}, [vector]);

	const arrowheadRef = useRef();

	const x = unitCircleRadius * vectorState.cartesian.x;
	const y = unitCircleRadius * -vectorState.cartesian.y;

	useDrag(arrowheadRef, (e) => {
		setVectorState((prevVec) => {
			const x = prevVec.cartesian.x + e.dx / unitCircleRadius;
			const y = prevVec.cartesian.y - e.dy / unitCircleRadius;
			const newVec = buildCartesianVector(x, y, prevVec.label, prevVec.id);
			updateVector(newVec);
			return newVec;
		});
	});

	return (
		<g>
			<path d={lineGenerator(getPath({ x, y }))} stroke="gray" />
			<Tooltip title={vectorState.label}>
				<path
					ref={arrowheadRef}
					d={lineGenerator(getArrowheadPath({ x, y }, arrowHeadScale))}
					stroke="gray"
					fill="gray"
					transform={`rotate(${mod(360 - vectorState.polar.angle, 360)} ${x} ${y})`}
				/>
			</Tooltip>
		</g>
	);
}

Axis.propTypes = {
	vector: PropTypes.object.isRequired,
	unitCircleRadius: PropTypes.number.isRequired,
	updateVector: PropTypes.func.isRequired,
};

export default Axis;
