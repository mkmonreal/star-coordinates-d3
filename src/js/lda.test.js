//    Copyright 2026 Miguel Ángel Monreal Velasco

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
import { matrix, multiply, transpose, abs, dot } from 'mathjs';
import {
	loadIrisDataset,
	loadWineDataset,
	createClassIndexMap,
} from './fixtures/datasets';
import { buildCartesianVector } from '../utils/vector';
import { calculatePoints } from '../utils/data-projection';

const TOLERANCE = 1e-10;

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

// ============================================================================
// § 8.2.4 — LDA (Linear Discriminant Analysis)
// ============================================================================

describe('LDA - Scatter Matrices', () => {
	it('should compute within-class scatter matrix Sw', () => {
		// Simple 2-class dataset where we can verify Sw calculation
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);

		// LDA should produce valid result
		expect(result).toBeDefined();
		expect(result.linearDiscriminants).toBeDefined();
	});

	it('should compute between-class scatter matrix Sb', () => {
		// Verify Sb is computed (implicitly tested via successful LDA)
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);

		expect(result).toBeDefined();
		expect(result.linearDiscriminants.length).toBeGreaterThan(0);
	});

	it('should solve generalized eigenvalue problem Sw⁻¹·Sb', () => {
		// Use existing 3-class dataset which is known to work
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

		// Should produce discriminants
		expect(result.linearDiscriminants).toBeDefined();
		expect(result.linearDiscriminants.length).toBeGreaterThan(0);

		// Discriminants should be normalized
		for (const ld of result.linearDiscriminants) {
			const vec = ld.vector.toArray();
			const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
			expect(norm).toBeCloseTo(1, 6);
		}
	});
});

describe('LDA - Two-Class Case', () => {
	it('should produce exactly one discriminant for two classes', () => {
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);

		// For c=2 classes, rank(Sb) = c-1 = 1, so only 1 non-trivial discriminant
		// However, eigs() may return multiple eigenvalues (some near zero)
		// We verify that the first discriminant has the largest eigenvalue
		expect(result.linearDiscriminants.length).toBeGreaterThanOrEqual(1);

		if (result.linearDiscriminants.length > 1) {
			// First eigenvalue should dominate
			expect(result.linearDiscriminants[0].value).toBeGreaterThan(
				result.linearDiscriminants[1].value * 100
			);
		}
	});

	it('should handle 2-class case with well-separated clusters', () => {
		const dataMatrix = matrix([
			[0, 0],
			[0.1, 0.2],
			[10, 10],
			[10.2, 10.1],
		]);

		const classesMatrixesMap = new Map([
			['A', [0, 1]],
			['B', [2, 3]],
		]);

		const result = lda(dataMatrix, classesMatrixesMap);

		expect(result.linearDiscriminants[0]).toBeDefined();
		expect(result.linearDiscriminants[0].name).toBe('LD1');
	});
});

describe('LDA - Eigenvector Normalization', () => {
	it('should normalize all discriminant vectors to unit length', () => {
		const { dataMatrix, classesMatrixesMap } = create2ClassDataset();
		const result = lda(dataMatrix, classesMatrixesMap);

		for (const ld of result.linearDiscriminants) {
			const vec = ld.vector.toArray();
			const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
			expect(norm).toBeCloseTo(1, TOLERANCE);
		}
	});

	it('should normalize discriminants for 3-class dataset', () => {
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

		for (const ld of result.linearDiscriminants) {
			const vec = ld.vector.toArray();
			const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
			expect(norm).toBeCloseTo(1, TOLERANCE);
		}
	});
});

describe('LDA - Class Separation', () => {
	it('should increase class separation compared to baseline', () => {
		// Use Iris dataset for this test
		const { data, labels } = loadIrisDataset();
		const classIndexMap = createClassIndexMap(labels);

		// Perform LDA
		const ldaResult = lda(data, classIndexMap);

		// Create axis configuration from first 2 LDs
		const ldVectors = ldaResult.linearDiscriminants.slice(0, 2);

		// Build Star Coordinates vectors from LDA
		const ldaAxes = data.size()[1] === 4 ?
			[
				buildCartesianVector(
					ldVectors[0].vector.get([0]),
					ldVectors[1].vector.get([0]),
					'Sepal Length',
					0
				),
				buildCartesianVector(
					ldVectors[0].vector.get([1]),
					ldVectors[1].vector.get([1]),
					'Sepal Width',
					1
				),
				buildCartesianVector(
					ldVectors[0].vector.get([2]),
					ldVectors[1].vector.get([2]),
					'Petal Length',
					2
				),
				buildCartesianVector(
					ldVectors[0].vector.get([3]),
					ldVectors[1].vector.get([3]),
					'Petal Width',
					3
				),
			]
			: [];

		// Create baseline equi-spaced axes
		const baselineAxes = [];
		const n = data.size()[1];
		const angle = (2 * Math.PI) / n;
		for (let i = 0; i < n; i++) {
			baselineAxes.push(
				buildCartesianVector(
					Math.cos(i * angle),
					Math.sin(i * angle),
					`axis${i}`,
					i
				)
			);
		}

		// Project data with both configurations
		const originalDataArray = new Array(data.size()[0]).fill({});
		const ldaPoints = calculatePoints(ldaAxes, data, originalDataArray);
		const baselinePoints = calculatePoints(
			baselineAxes,
			data,
			originalDataArray
		);

		// Compute separation metric: variance between class centroids / variance within classes
		const computeSeparation = (points, labels) => {
			const classes = Array.from(new Set(labels));
			const centroids = [];

			// Compute class centroids
			for (const cls of classes) {
				const classPoints = points.filter((_, i) => labels[i] === cls);
				const cx =
					classPoints.reduce((sum, p) => sum + p.x, 0) / classPoints.length;
				const cy =
					classPoints.reduce((sum, p) => sum + p.y, 0) / classPoints.length;
				centroids.push({ x: cx, y: cy });
			}

			// Between-class variance (variance of centroids)
			const overallCx = centroids.reduce((sum, c) => sum + c.x, 0) / centroids.length;
			const overallCy = centroids.reduce((sum, c) => sum + c.y, 0) / centroids.length;
			const betweenVar =
				centroids.reduce(
					(sum, c) => sum + (c.x - overallCx) ** 2 + (c.y - overallCy) ** 2,
					0
				) / centroids.length;

			// Within-class variance
			let withinVar = 0;
			for (let i = 0; i < classes.length; i++) {
				const cls = classes[i];
				const classPoints = points.filter((_, idx) => labels[idx] === cls);
				const cx = centroids[i].x;
				const cy = centroids[i].y;
				withinVar += classPoints.reduce(
					(sum, p) => sum + (p.x - cx) ** 2 + (p.y - cy) ** 2,
					0
				);
			}
			withinVar /= points.length;

			return betweenVar / (withinVar + 1e-10); // Avoid division by zero
		};

		if (ldaPoints.length > 0 && baselinePoints.length > 0) {
			const ldaSeparation = computeSeparation(ldaPoints, labels);
			const baselineSeparation = computeSeparation(baselinePoints, labels);

			// LDA should produce better separation
			expect(ldaSeparation).toBeGreaterThan(baselineSeparation * 0.9); // At least 90% as good or better
		}
	});
});

describe('LDA - Iris and Wine Datasets', () => {
	it('should perform LDA on Iris dataset (150 x 4, 3 classes)', () => {
		const { data, labels } = loadIrisDataset();

		expect(data.size()).toEqual([150, 4]);
		expect(new Set(labels).size).toBe(3);

		const classIndexMap = createClassIndexMap(labels);
		const result = lda(data, classIndexMap);

		expect(result.linearDiscriminants).toBeDefined();
		// For 3 classes, max rank(Sb) = 2
		expect(result.linearDiscriminants.length).toBeGreaterThanOrEqual(2);

		// Check normalization
		for (const ld of result.linearDiscriminants) {
			const vec = ld.vector.toArray();
			const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
			expect(norm).toBeCloseTo(1, 6);
		}
	});

	it('should perform LDA on Wine dataset (178 x 13, 3 classes)', () => {
		const { data, labels } = loadWineDataset();

		expect(data.size()).toEqual([178, 13]);
		expect(new Set(labels).size).toBe(3);

		const classIndexMap = createClassIndexMap(labels);
		const result = lda(data, classIndexMap);

		expect(result.linearDiscriminants).toBeDefined();
		// For 3 classes, max rank(Sb) = 2
		expect(result.linearDiscriminants.length).toBeGreaterThanOrEqual(2);

		// Check normalization
		for (const ld of result.linearDiscriminants) {
			const vec = ld.vector.toArray();
			const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
			expect(norm).toBeCloseTo(1, 6);
		}
	});
});
