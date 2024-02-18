import { useState } from "react";
import Axis from "./Axis.jsx";
import Circle from "./Circle.jsx";

import { buildCartesianVector } from "../utils/vector.js";
import { useRef } from "react";
import useDrag from "../hooks/useDrag.js";

const StarCoordinates = ({ height, width }) => {
    let centerX = width / 2;
    let centerY = height / 2;

    const [minX, setMinX] = useState(-centerX);
    const [minY, setMinY] = useState(-centerY);
    const [vectors, setVectors] = useState(() => {
        const vectors = [];
        for (let i = 0; i < 6; i++) {
            const newVector = buildCartesianVector(Math.random() * 150, Math.random() * 150);
            vectors.push({ ...newVector, id: i });
        }
        return vectors;
    });

    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            id: i,
            x: Math.floor(Math.random() * 150),
            y: Math.floor(Math.random() * 150)
        })
    }

    const svgRef = useRef();
    useDrag(svgRef, (event) => {
        setMinX(minX => minX - event.dx);
        setMinY(minY => minY - event.dy);
    });


    return (
        <>
            <svg
                ref={svgRef}
                height={height}
                width={width}
                viewBox={`${minX} ${minY} ${width} ${height}`}
            >
                <Circle
                    cx={0}
                    cy={0}
                    radius="150"
                    stroke="grey"
                    fill="none"
                />
                {vectors && vectors.map(vector =>
                    <Axis
                        key={vector.id}
                        vector={ vector }
                    />
                )}

                <g>
                    {data && data.map(value => {
                        return (
                            <Circle
                                key={value.id}
                                cx={value.x}
                                cy={value.y}
                                radius={5}
                                stroke="salmon"
                                fill="lightsalmon"
                            />
                        );
                    })}
                </g>
            </svg>
        </>
    );
};

export default StarCoordinates;
