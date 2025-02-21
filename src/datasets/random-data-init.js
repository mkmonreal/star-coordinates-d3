import { buildCartesianVector } from '../utils/vector';
import normalizeData from '../js/data/normalize';

export function createRandomData() {
	const randomData = [];
	for (let i = 0; i < 100; i += 1) {
		randomData.push({
			id: i,
			x: Math.floor(Math.random() * 150),
			y: Math.floor(Math.random() * 150),
		});
	}
	return randomData;
}

export function createRandomVectors() {
	const randomVectors = [];
	for (let i = 0; i < 6; i += 1) {
		const newVector = buildCartesianVector((Math.random() * 300) - 150, (Math.random() * 300) - 150, `lable ${+i}`);
		newVector.id = `${+i}`;
		randomVectors.push(newVector);
	}
	return randomVectors;
}

export function createRandomDataAndVectors() {
	const randomData = [];
	const randomVectors = createRandomVectors();
	const lables = randomVectors.map((x) => x.lable);

	for (let i = 0; i < 100; i += 1) {
		const d = { id: i };
		lables.forEach((lable) => {
			d[lable] = (Math.floor(Math.random() * 150));
		});
		randomData.push(d);
	}

	return [normalizeData(randomData, lables), randomVectors];
}
