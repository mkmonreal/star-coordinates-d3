import { mod } from 'mathjs';

export function getArrowheadPath({ x, y }, ratio = 1) {
	y = -y;
	return [
		[x - 15 * ratio, y],
		[x - 18 * ratio, y + 6 * ratio],
		[x, y],
		[x - 18 * ratio, y - 6 * ratio],
		[x - 15 * ratio, y],
	];
}

export function getArrowbodyPath(x, y, unitCircleRadius = 1) {
	y = -y;
	return [
		[0, 0],
		[x * unitCircleRadius, y * unitCircleRadius],
	];
}

export function calculateArrowheadRotation(x, y, angle, unitCircleRadius = 1) {
	y = -y;
	return `${mod(360 - angle, 360)} ${x * unitCircleRadius}, ${y * unitCircleRadius}`;
}
