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
import { matrix, column, min, max, mean, std } from 'mathjs';
import normalizeData from './normalize';
import standarizeData from './standarize';
import { loadIrisDataset, loadWineDataset } from '../fixtures/datasets';

const TOLERANCE = 1e-10;

// ============================================================================
// § 8.2.1 — Normalización Min-Max
// ============================================================================

describe('Min-Max Normalization', () => {
	it('should map each dimension to [0, 1] range', () => {
		const data = matrix([
			[1, 10, 100],
			[2, 20, 200],
			[3, 30, 300],
			[4, 40, 400],
		]);

		const normalized = normalizeData(data);
		const [nRows, nCols] = normalized.size();

		// For each dimension, verify all values are in [0, 1]
		for (let j = 0; j < nCols; j++) {
			const col = column(normalized, j).toArray().flat();

			for (const value of col) {
				expect(value).toBeGreaterThanOrEqual(0);
				expect(value).toBeLessThanOrEqual(1);
			}
		}
	});

	it('should map min to 0 and max to 1 for each dimension', () => {
		const data = matrix([
			[1, 10, 100],
			[5, 50, 500],
			[3, 30, 300],
		]);

		const normalized = normalizeData(data);
		const [_, nCols] = normalized.size();

		for (let j = 0; j < nCols; j++) {
			const originalCol = column(data, j).toArray().flat();
			const normalizedCol = column(normalized, j).toArray().flat();

			const originalMin = min(originalCol);
			const originalMax = max(originalCol);

			// Find indices of min and max in original
			const minIndex = originalCol.indexOf(originalMin);
			const maxIndex = originalCol.indexOf(originalMax);

			// Verify they map to 0 and 1
			expect(normalizedCol[minIndex]).toBeCloseTo(0, 10);
			expect(normalizedCol[maxIndex]).toBeCloseTo(1, 10);
		}
	});

	it('should apply formula: x_norm = (x - min(x)) / (max(x) - min(x))', () => {
		const data = matrix([
			[2, 8],
			[4, 6],
			[6, 4],
		]);

		const normalized = normalizeData(data);

		// First column: min=2, max=6, range=4
		// [2,4,6] -> [0, 0.5, 1]
		const col0 = column(normalized, 0).toArray().flat();
		expect(col0[0]).toBeCloseTo(0, TOLERANCE);
		expect(col0[1]).toBeCloseTo(0.5, TOLERANCE);
		expect(col0[2]).toBeCloseTo(1, TOLERANCE);

		// Second column: min=4, max=8, range=4
		// [8,6,4] -> [1, 0.5, 0]
		const col1 = column(normalized, 1).toArray().flat();
		expect(col1[0]).toBeCloseTo(1, TOLERANCE);
		expect(col1[1]).toBeCloseTo(0.5, TOLERANCE);
		expect(col1[2]).toBeCloseTo(0, TOLERANCE);
	});

	it('should normalize Iris dataset to [0, 1] for each dimension', () => {
		const { data } = loadIrisDataset();
		const normalized = normalizeData(data);

		// Verify dimensions: 150 x 4
		expect(normalized.size()).toEqual([150, 4]);

		const [_, nCols] = normalized.size();

		for (let j = 0; j < nCols; j++) {
			const col = column(normalized, j).toArray().flat();

			// Check min and max
			const colMin = min(col);
			const colMax = max(col);

			expect(colMin).toBeCloseTo(0, TOLERANCE);
			expect(colMax).toBeCloseTo(1, TOLERANCE);

			// Check all values in range
			for (const value of col) {
				expect(value).toBeGreaterThanOrEqual(0);
				expect(value).toBeLessThanOrEqual(1);
			}
		}
	});

	it('should normalize Wine dataset to [0, 1] for each dimension', () => {
		const { data } = loadWineDataset();
		const normalized = normalizeData(data);

		// Verify dimensions: 178 x 13
		expect(normalized.size()).toEqual([178, 13]);

		const [_, nCols] = normalized.size();

		for (let j = 0; j < nCols; j++) {
			const col = column(normalized, j).toArray().flat();

			// Check min and max
			const colMin = min(col);
			const colMax = max(col);

			expect(colMin).toBeCloseTo(0, TOLERANCE);
			expect(colMax).toBeCloseTo(1, TOLERANCE);

			// Check all values in range
			for (const value of col) {
				expect(value).toBeGreaterThanOrEqual(0);
				expect(value).toBeLessThanOrEqual(1);
			}
		}
	});
});

// ============================================================================
// § 8.2.1 — Normalización Z-score (Standardization)
// ============================================================================

describe('Z-score Standardization', () => {
	it('should transform each dimension to mean=0, std=1', () => {
		const data = matrix([
			[1, 10],
			[2, 20],
			[3, 30],
			[4, 40],
			[5, 50],
		]);

		const standardized = standarizeData(data);
		const [_, nCols] = standardized.size();

		for (let j = 0; j < nCols; j++) {
			const col = column(standardized, j);

			const colMean = mean(col);
			const colStd = std(col);

			expect(colMean).toBeCloseTo(0, TOLERANCE);
			expect(colStd).toBeCloseTo(1, TOLERANCE);
		}
	});

	it('should apply formula: z = (x - mean(x)) / std(x)', () => {
		const data = matrix([
			[2],
			[4],
			[6],
			[8],
		]);

		const standardized = standarizeData(data);

		// mean = 5, std = sqrt(5) ≈ 2.236
		// [2,4,6,8] -> [(-3/sqrt(5)), (-1/sqrt(5)), (1/sqrt(5)), (3/sqrt(5))]
		const col = column(standardized, 0).toArray().flat();

		const expectedStd = Math.sqrt(5);
		expect(col[0]).toBeCloseTo(-3 / expectedStd, TOLERANCE);
		expect(col[1]).toBeCloseTo(-1 / expectedStd, TOLERANCE);
		expect(col[2]).toBeCloseTo(1 / expectedStd, TOLERANCE);
		expect(col[3]).toBeCloseTo(3 / expectedStd, TOLERANCE);
	});

	it('should standardize Iris dataset to mean=0, std=1 for each dimension', () => {
		const { data } = loadIrisDataset();
		const standardized = standarizeData(data);

		// Verify dimensions: 150 x 4
		expect(standardized.size()).toEqual([150, 4]);

		const [_, nCols] = standardized.size();

		for (let j = 0; j < nCols; j++) {
			const col = column(standardized, j);

			const colMean = mean(col);
			const colStd = std(col);

			expect(colMean).toBeCloseTo(0, TOLERANCE);
			expect(colStd).toBeCloseTo(1, TOLERANCE);
		}
	});

	it('should standardize Wine dataset to mean=0, std=1 for each dimension', () => {
		const { data } = loadWineDataset();
		const standardized = standarizeData(data);

		// Verify dimensions: 178 x 13
		expect(standardized.size()).toEqual([178, 13]);

		const [_, nCols] = standardized.size();

		for (let j = 0; j < nCols; j++) {
			const col = column(standardized, j);

			const colMean = mean(col);
			const colStd = std(col);

			expect(colMean).toBeCloseTo(0, TOLERANCE);
			expect(colStd).toBeCloseTo(1, TOLERANCE);
		}
	});

	it('should handle zero standard deviation (constant column)', () => {
		const data = matrix([
			[5, 1],
			[5, 2],
			[5, 3],
		]);

		const standardized = standarizeData(data);

		// First column is constant → std=0 → should return 0
		const col0 = column(standardized, 0).toArray().flat();
		expect(col0[0]).toBe(0);
		expect(col0[1]).toBe(0);
		expect(col0[2]).toBe(0);

		// Second column should be standardized normally
		const col1 = column(standardized, 1);
		expect(mean(col1)).toBeCloseTo(0, TOLERANCE);
		expect(std(col1)).toBeCloseTo(1, TOLERANCE);
	});
});
