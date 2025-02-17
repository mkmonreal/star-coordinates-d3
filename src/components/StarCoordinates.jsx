import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useDrag from '../hooks/useDrag';
import { buildCartesianVector } from '../utils/vector';

import Axis from './Axis';
import Circle from './Circle';

function StarCoordinates({ height, width }) {
  const centerX = width / 2;
  const centerY = height / 2;

  const [minX, setMinX] = useState(-centerX);
  const [minY, setMinY] = useState(-centerY);
  const [data, setData] = useState([]);

  const originalVecotrs = [];
  for (let i = 0; i < 6; i += 1) {
    const newVector = buildCartesianVector(Math.random() * 150, Math.random() * 150, `lable ${i}`);
    originalVecotrs.push({ ...newVector, id: i });
  }
  const [vectors, setVectors] = useState(originalVecotrs);

  const vectorMovementHandler = (newVector) => {
    setVectors((prevVectors) => {
      // console.log(`Actualizando vector ${newVector.lable}`);
      // console.log(prevVectors);
      let newVectors = prevVectors.slice();
      newVectors = newVectors.map((vector) => (vector.lable === newVector.lable
        ? { ...newVector, id: vector.id }
        : vector));
      console.log('vectors: ', newVectors);
      return newVectors;
    });
  };

  useEffect(() => {
    const randomData = [];
    for (let i = 0; i < 100; i += 1) {
      randomData.push({
        id: i,
        x: Math.floor(Math.random() * 150),
        y: Math.floor(Math.random() * 150),
      });
    }
    setData(randomData);
  }, []);

  const svgRef = useRef();
  useDrag(svgRef, (event) => {
    console.log('event', event);
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
      {originalVecotrs && originalVecotrs.map((vector) => (
        <Axis
          key={vector.lable}
          vector={vector}
          dragHandler={vectorMovementHandler}
        />
      ))}

      <g>
        {data && data.map((value) => (
          <Circle
            key={value.id}
            cx={value.x}
            cy={value.y}
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
