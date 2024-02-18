import { useRef } from "react";
import useDrag from "../hooks/useDrag.js";
import { buildCartesianVector } from "../utils/vector.js";
import { line } from "d3";

const Axis = ({ vector }) => {
    const {cartesian, polar} = vector;
    const {x, y} = cartesian;
    const {angle} = polar;

    const arrowheadRef = useRef();

    const lineGenerator = line();

    const getArrowheadPath = ({ x, y }) => { return [
        [x - 15, y],
        [x - 18, y + 6],
        [x, y],
        [x - 18, y - 6],
        [x - 15, y]
    ]};

    const getPath = ({ x, y }) => [
        [0, 0],
        [x, y]
    ];

    useDrag(arrowheadRef, (e) => {
        const newVector = buildCartesianVector(e.x, -e.y);
        console.log(newVector);
        // TODO: update vector and render
    });

    return (
        <g>
            <path
                d={lineGenerator(getPath({x, y}))}
                stroke="gray">
            </path>
            <path
                ref={arrowheadRef}
                d={lineGenerator(getArrowheadPath({x, y}))}
                stroke="gray"
                fill="gray"
                transform={
                    `rotate(${angle},
                        ${x},
                        ${y})`
                }
            >
            </path>
        </g>
    );
};

export default Axis;
