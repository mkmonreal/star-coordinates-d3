//    Copyright 2025 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

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
