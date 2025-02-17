import PropTypes from 'prop-types';

function Circle({
  cx, cy, radius, stroke, fill,
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      stroke={stroke}
      fill={fill}
    />
  );
}

export default Circle;
