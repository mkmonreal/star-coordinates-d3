import { useRef } from "react";
import useAxis from "../hooks/useAxis.js";
import useDrag from "../hooks/useDrag.js";
import { buildCartesianVector } from "../utils/vector.js";

const Axis = ({ vector }) => {
    const arrowheadRef = useRef();

    const { path, arrowheadPath, angle, x, y } = useAxis(vector);
    useDrag(arrowheadRef, (e) => {
        const newVector = buildCartesianVector(e.x, -e.y);
    // TODO: update vector and render
    });

    return (
        <g>
            <path
                d={path}
                stroke="gray">
            </path>
            <path
                ref={arrowheadRef}
                d={arrowheadPath}
                stroke="gray"
                fill="gray"
                transform={`rotate(${angle}, ${x}, ${y})`}
            >
            </path>
        </g>
    );
};

export default Axis;
