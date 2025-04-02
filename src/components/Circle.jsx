import { orange, volcano } from '@ant-design/colors';
import PropTypes from 'prop-types';

function Circle({
	cx,
	cy,
	radius,
	stroke = volcano.primary,
	fill = orange.primary,
}) {
	if (isNaN(cx) || isNaN(cy) || isNaN(radius)) {
		return null;
	}
	if (radius < 0) {
		return null;
	}

	return <circle cx={cx} cy={cy} r={radius} stroke={stroke} fill={fill} />;
}

Circle.propTypes = {
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	radius: PropTypes.number.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
};

export default Circle;
