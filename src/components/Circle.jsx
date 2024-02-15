const Circle = ({ cx, cy, radius, stroke, fill }) => {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={stroke}
            fill={fill}
        >
        </circle>
    );
};

export default Circle;