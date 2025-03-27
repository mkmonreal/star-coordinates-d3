import Circle from './Circle';

function DataCircle({
	matrixRow,
	radius,
	stroke,
	fill,
	unitCircleRadius,
	vectors,
	columnsDict,
}) {
	if (!vectors || vectors.length === 0) {
		return null;
	}
	if (!matrixRow) {
		return null;
	}

	let cx = 0;
	let cy = 0;

	if (isNaN(cx) || isNaN(cy)) {
		return null;
	}

	for (const vector of vectors) {
		cx +=
			matrixRow[columnsDict[vector.label]] *
			vector.cartesian.x *
			unitCircleRadius;
		cy +=
			matrixRow[columnsDict[vector.label]] *
			vector.cartesian.y *
			unitCircleRadius;
	}

	return (
		<Circle cx={cx} cy={-cy} radius={radius} stroke={stroke} fill={fill} />
	);
}

export default DataCircle;
