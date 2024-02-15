import { line } from "d3";
import { useState, useEffect } from "react";

const useAxis = ({ vector }) => {
    const lineGenerator = line();

    const getArrowheadPath = ({ x, y }) => [
        [x - 15, y],
        [x - 18, y + 6],
        [x, y],
        [x - 18, y - 6],
        [x - 15, y]
    ];

    const getPath = ({ x, y }) => [
        [0, 0],
        [x, y]
    ];

    const [x, setX] = useState(() => vector.cartesian.x || 0);
    const [y, setY] = useState(() => vector.cartesian.x || 0);
    const [angle, setAngle] = useState(() => vector.polar.angle || 0);

    useEffect(() => {
        setX(vector.cartesian.x);
        setY(vector.cartesian.y);
        setAngle(vector.polar.angle);
    }, [vector]);

    return {
        path: lineGenerator(getPath({ x, y })),
        arrowheadPath: lineGenerator(getArrowheadPath({ x, y })),
        angle,
        x,
        y
    }
};

export default useAxis;