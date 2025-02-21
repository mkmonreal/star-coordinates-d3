import Circle from './Circle';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

function DataCircle({
	dataRow, radius, stroke, fill,
}) {
	const vectors = useStarCoordinatesStore((state) => state.vectors);

	let cx = 0;
	let cy = 0;

	vectors.forEach((vector) => {
		cx += (dataRow[vector.lable] * vector.cartesian.x);
		cy += (dataRow[vector.lable] * vector.cartesian.y);
	});

	return (<Circle cx={cx} cy={-cy} radius={radius} stroke={stroke} fill={fill} />);
}

export default DataCircle;
