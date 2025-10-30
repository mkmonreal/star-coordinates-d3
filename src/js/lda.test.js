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
import { lda } from './lda';
import { matrix } from 'mathjs';

const create2ClassDataset = () => ({
	dataMatrix: matrix([
		[1, 2],
		[1.2, 2.8],
		[1.8, 2.2],
		[4, 1],
		[4.8, 1.2],
		[4.2, 1.8],
	]),
	classesMatrixesMap: new Map([
		['class1', [0, 1, 2]],
		['class2', [3, 4, 5]],
	]),
});

const assertValidLdaResult = (result) => {
	expect(result).toBeDefined();
	expect(result.linearDiscriminants).toBeDefined();
	expect(Array.isArray(result.linearDiscriminants)).toBe(true);
	expect(result.linearDiscriminants.length).toBeGreaterThan(0);
};

describe('lda', () => {
	it('should return undefined for null or undefined inputs', () => {
		expect(lda(null, null)).toBeUndefined();
		expect(lda(undefined, undefined)).toBeUndefined();
		expect(lda(matrix([[1, 2]]), null)).toBeUndefined();
		expect(lda(null, new Map())).toBeUndefined();
	});

	it('should perform LDA on a simple 2D dataset with 2 classes', () => {
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);
		assertValidLdaResult(result);
	});

	it('should create linear discriminants with proper naming', () => {
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);

		expect(result.linearDiscriminants[0]).toHaveProperty('name');
		expect(result.linearDiscriminants[0].name).toBe('LD1');
		if (result.linearDiscriminants[1]) {
			expect(result.linearDiscriminants[1].name).toBe('LD2');
		}
	});

	it('should handle 3D data with multiple classes', () => {
		const dataMatrix = matrix([
			[2, 1, 3],
			[2.2, 1.3, 2.8],
			[1.8, 0.9, 3.2],
			[5, 4, 1],
			[5.3, 4.2, 1.1],
			[4.7, 3.8, 0.9],
			[1, 5, 2],
			[1.2, 5.3, 2.2],
			[0.8, 4.7, 1.8],
		]);

		const classesMatrixesMap = new Map([
			['class1', [0, 1, 2]],
			['class2', [3, 4, 5]],
			['class3', [6, 7, 8]],
		]);

		const result = lda(dataMatrix, classesMatrixesMap);
		assertValidLdaResult(result);
	});

	it('should sort linear discriminants by eigenvalue in descending order', () => {
		const dataMatrix = matrix([
			[1, 2],
			[1.8, 2.3],
			[5, 1],
			[5.2, 1.9],
		]);

		const classesMatrixesMap = new Map([
			['class1', [0, 1]],
			['class2', [2, 3]],
		]);

		const result = lda(dataMatrix, classesMatrixesMap);

		expect(result.linearDiscriminants).toBeDefined();
		if (result.linearDiscriminants.length > 1) {
			expect(result.linearDiscriminants[0].value).toBeGreaterThanOrEqual(
				result.linearDiscriminants[1].value
			);
		}
	});
});
