import { line } from 'd3';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import useDrag from '../hooks/useDrag';
import { buildCartesianVector } from '../utils/vector';

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

function Axis({
  vector, dragHandler,
}) {
  const {
    cartesian, polar, lable, id,
  } = vector;
  const { x, y } = cartesian;
  const { angle } = polar;

  const arrowheadRef = useRef();

  useDrag(arrowheadRef, (e) => {
    const newVector = buildCartesianVector(x + e.dx, y - e.dy, lable, id);
    dragHandler(newVector);
  });

  return (
    <g>
      <path
        d={lineGenerator(getPath({ x, y: -y }))}
        stroke="gray"
      />
      <path
        ref={arrowheadRef}
        d={lineGenerator(getArrowheadPath({ x, y: -y }))}
        stroke="gray"
        fill="gray"
        transform={`rotate(${-angle}, ${x}, ${-y})`}
      />
    </g>
  );
}

export default Axis;
