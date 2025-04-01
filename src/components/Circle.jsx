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

export default Circle;
