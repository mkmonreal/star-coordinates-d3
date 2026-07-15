//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
