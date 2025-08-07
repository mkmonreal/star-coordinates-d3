import Circle from './Circle';
import PropTypes from 'prop-types';

function DataCircle({
	matrixRow,
	radius,
	stroke,
	fill,
	unitCircleRadius,
	vectors,
	columnsDict,
}) {
	if (!columnsDict) {
		return null;
	}
	const columns = columnsDict.keys().toArray();
	if (!columns || columns.length === 0) {
		return null;
	}
	if (!vectors || vectors.length === 0 || vectors.length !== columns.length) {
		return null;
	}
	if (!matrixRow) {
		return null;
	}

	let cx = 0;
	let cy = 0;

	for (const vector of vectors) {
		cx +=
			matrixRow[columnsDict.get(vector.label)] *
			vector.cartesian.x *
			unitCircleRadius;
		cy +=
			matrixRow[columnsDict.get(vector.label)] *
			vector.cartesian.y *
			unitCircleRadius;
	}

	return (
		<Circle cx={cx} cy={-cy} radius={radius} stroke={stroke} fill={fill} />
	);
}

DataCircle.propTypes = {
	matrixRow: PropTypes.array.isRequired,
	radius: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	fill: PropTypes.string.isRequired,
	unitCircleRadius: PropTypes.number.isRequired,
	vectors: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			cartesian: PropTypes.shape({
				x: PropTypes.number.isRequired,
				y: PropTypes.number.isRequired,
			}).isRequired,
		})
	).isRequired,
	columnsDict: PropTypes.object.isRequired,
};

export default DataCircle;
