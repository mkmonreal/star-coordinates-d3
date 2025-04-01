import { unit, cos, sin, atan2, sqrt } from 'mathjs';

const toDeg = (rad) => rad * (180 / Math.PI);

const addCartesian = (vector) => {
	const angleUnit = unit(vector.polar.angle, 'deg');
	const x = vector.polar.module * cos(angleUnit);
	const y = vector.polar.module * sin(angleUnit);
	vector.cartesian = { x, y };
	return vector;
};

const addPolar = (vector) => {
	const module = sqrt(vector.cartesian.x ** 2 + vector.cartesian.y ** 2);
	const angle = toDeg(atan2(vector.cartesian.y, vector.cartesian.x));
	vector.polar = { module, angle };
	return vector;
};

const buildPolarVector = (module, angle, label, id) => {
	const vector = {};
	if (label || label === '') {
		vector.label = label;
	}
	if (id || id === '') {
		vector.id = id;
	}
	vector.polar = { module, angle };
	return addCartesian(vector);
};

const buildCartesianVector = (x, y, label, id) => {
	const vector = {};
	if (label || label === '') {
		vector.label = label;
	}
	if (id || id === '') {
		vector.id = id;
	}
	vector.cartesian = { x, y };
	return addPolar(vector);
};

const addLable = (vector, label) => {
	vector.label = label;
	return vector;
};

export { buildPolarVector, buildCartesianVector, addLable };
