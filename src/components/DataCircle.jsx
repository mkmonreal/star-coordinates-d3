import Circle from './Circle';

function DataCircle({
	dataRow,
	radius,
	stroke,
	fill,
	unitCircleRadius,
	vectors,
}) {
	if (!vectors || vectors.length === 0) {
		return null;
	}

	let cx = 0;
	let cy = 0;

	for (const vector of vectors) {
		cx += dataRow[vector.lable] * vector.cartesian.x * unitCircleRadius;
		cy += dataRow[vector.lable] * vector.cartesian.y * unitCircleRadius;
	}

	return (
		<Circle cx={cx} cy={-cy} radius={radius} stroke={stroke} fill={fill} />
	);
}

export default DataCircle;
