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

import { describe, it, expect } from 'vitest';
import { initializeMatrixArrayWithValues } from '../array';

describe('initializeMatrixArrayWithValues', () => {
	it('should create a matrix with default value 0', () => {
		const result = initializeMatrixArrayWithValues(2, 3);

		expect(result).toHaveLength(2);
		expect(result[0]).toHaveLength(3);
		expect(result[1]).toHaveLength(3);
		expect(result).toEqual([
			[0, 0, 0],
			[0, 0, 0],
		]);
	});

	it('should create a matrix with custom value', () => {
		const result = initializeMatrixArrayWithValues(3, 2, 5);

		expect(result).toHaveLength(3);
		expect(result[0]).toHaveLength(2);
		expect(result[1]).toHaveLength(2);
		expect(result[2]).toHaveLength(2);
		expect(result).toEqual([
			[5, 5],
			[5, 5],
			[5, 5],
		]);
	});

	it('should create a 1x1 matrix', () => {
		const result = initializeMatrixArrayWithValues(1, 1, 42);

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveLength(1);
		expect(result).toEqual([[42]]);
	});

	it('should create a matrix with negative values', () => {
		const result = initializeMatrixArrayWithValues(2, 2, -1);

		expect(result).toEqual([
			[-1, -1],
			[-1, -1],
		]);
	});

	it('should create a matrix with decimal values', () => {
		const result = initializeMatrixArrayWithValues(2, 3, 3.14);

		expect(result).toEqual([
			[3.14, 3.14, 3.14],
			[3.14, 3.14, 3.14],
		]);
	});

	it('should create empty arrays when dimensions are 0', () => {
		const result1 = initializeMatrixArrayWithValues(0, 3);
		const result2 = initializeMatrixArrayWithValues(3, 0);

		expect(result1).toHaveLength(0);
		expect(result1).toEqual([]);

		expect(result2).toHaveLength(3);
		expect(result2[0]).toHaveLength(0);
		expect(result2).toEqual([[], [], []]);
	});

	it('should handle large matrices', () => {
		const result = initializeMatrixArrayWithValues(100, 50, 1);

		expect(result).toHaveLength(100);
		expect(result[0]).toHaveLength(50);
		expect(result[99]).toHaveLength(50);
		expect(result[0][0]).toBe(1);
		expect(result[99][49]).toBe(1);
	});

	it('should create independent arrays (no reference sharing)', () => {
		const result = initializeMatrixArrayWithValues(3, 3, 0);

		result[0][0] = 1;
		result[1][1] = 2;
		result[2][2] = 3;

		expect(result[0]).toEqual([1, 0, 0]);
		expect(result[1]).toEqual([0, 2, 0]);
		expect(result[2]).toEqual([0, 0, 3]);
	});

	it('should handle string values', () => {
		const result = initializeMatrixArrayWithValues(2, 2, 'test');

		expect(result).toEqual([
			['test', 'test'],
			['test', 'test'],
		]);
	});

	it('should handle null and undefined values', () => {
		const result1 = initializeMatrixArrayWithValues(2, 2, null);
		const result2 = initializeMatrixArrayWithValues(2, 2, undefined);

		expect(result1).toEqual([
			[null, null],
			[null, null],
		]);

		expect(result2).toEqual([
			[0, 0],
			[0, 0],
		]);
	});
});
