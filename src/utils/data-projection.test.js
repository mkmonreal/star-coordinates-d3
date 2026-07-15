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

import { describe, it, expect } from 'vitest';
import { matrix } from 'mathjs';
import { calculatePoints } from './data-projection';
import { buildCartesianVector } from './vector';

const TOLERANCE = 1e-10;

// ============================================================================
// § 8.2.2 — Proyección: P = X·V
// ============================================================================

describe('Star Coordinates Projection', () => {
	it('should calculate P = X·V correctly for simple case', () => {
		// X = [[1, 2], [3, 4]] (2 samples, 2 dimensions)
		// V = [[1, 0], [0, 1]]ᵀ (2 axes: (1,0) and (0,1))
		const X = matrix([
			[1, 2],
			[3, 4],
		]);

		const vectors = [
			buildCartesianVector(1, 0, 'x1', 0),
			buildCartesianVector(0, 1, 'x2', 1),
		];

		const originalData = [{}, {}]; // Dummy data for ids

		const points = calculatePoints(vectors, X, originalData);

		// P = X·V = [[1,2],[3,4]] · [[1,0],[0,1]] = [[1,2],[3,4]]
		expect(points.length).toBe(2);
		expect(points[0].x).toBeCloseTo(1, TOLERANCE);
		expect(points[0].y).toBeCloseTo(2, TOLERANCE);
		expect(points[1].x).toBeCloseTo(3, TOLERANCE);
		expect(points[1].y).toBeCloseTo(4, TOLERANCE);
	});

	it('should calculate projection with scaled vectors', () => {
		// X = [[2, 3]]
		// V = [[0.5, 0], [0, 0.5]]ᵀ
		const X = matrix([[2, 3]]);

		const vectors = [
			buildCartesianVector(0.5, 0, 'axis0', 0),
			buildCartesianVector(0, 0.5, 'axis1', 1),
		];

		const originalData = [{}];

		const points = calculatePoints(vectors, X, originalData);

		// P = [[2,3]] · [[0.5,0],[0,0.5]] = [[1, 1.5]]
		expect(points[0].x).toBeCloseTo(1, TOLERANCE);
		expect(points[0].y).toBeCloseTo(1.5, TOLERANCE);
	});

	it('should handle 3D data projected to 2D', () => {
		// 1 sample with 3 features
		const X = matrix([[1, 2, 3]]);

		// 3 axes positioned at 120° intervals
		const angle = (2 * Math.PI) / 3;
		const vectors = [
			buildCartesianVector(Math.cos(0), Math.sin(0), 'a', 0),
			buildCartesianVector(Math.cos(angle), Math.sin(angle), 'b', 1),
			buildCartesianVector(Math.cos(2 * angle), Math.sin(2 * angle), 'c', 2),
		];

		const originalData = [{}];
		const points = calculatePoints(vectors, X, originalData);

		// Manual calculation:
		// x = 1*cos(0) + 2*cos(120°) + 3*cos(240°)
		//   = 1*1 + 2*(-0.5) + 3*(-0.5) = 1 - 1 - 1.5 = -1.5
		// y = 1*sin(0) + 2*sin(120°) + 3*sin(240°)
		//   = 0 + 2*(√3/2) + 3*(-√3/2) = √3 - 1.5√3 = -0.5√3

		expect(points[0].x).toBeCloseTo(-1.5, 5);
		expect(points[0].y).toBeCloseTo(-0.5 * Math.sqrt(3), 5);
	});

	it('should project multiple samples correctly', () => {
		const X = matrix([
			[1, 0],
			[0, 1],
			[1, 1],
		]);

		const vectors = [
			buildCartesianVector(1, 0, 'x', 0),
			buildCartesianVector(0, 1, 'y', 1),
		];

		const originalData = [{}, {}, {}];
		const points = calculatePoints(vectors, X, originalData);

		expect(points.length).toBe(3);

		// First sample: [1,0] -> (1,0)
		expect(points[0].x).toBeCloseTo(1, TOLERANCE);
		expect(points[0].y).toBeCloseTo(0, TOLERANCE);

		// Second sample: [0,1] -> (0,1)
		expect(points[1].x).toBeCloseTo(0, TOLERANCE);
		expect(points[1].y).toBeCloseTo(1, TOLERANCE);

		// Third sample: [1,1] -> (1,1)
		expect(points[2].x).toBeCloseTo(1, TOLERANCE);
		expect(points[2].y).toBeCloseTo(1, TOLERANCE);
	});

	it('should preserve original data reference in points', () => {
		const X = matrix([[1, 2]]);
		const vectors = [
			buildCartesianVector(1, 0, 'a', 0),
			buildCartesianVector(0, 1, 'b', 1),
		];
		const originalData = [{ name: 'sample1', value: 42 }];

		const points = calculatePoints(vectors, X, originalData);

		expect(points[0].originalValue).toEqual({ name: 'sample1', value: 42 });
		expect(points[0].id).toBe(0);
	});

	it('should handle zero vectors', () => {
		const X = matrix([[5, 10]]);
		const vectors = [
			buildCartesianVector(0, 0, 'zero1', 0),
			buildCartesianVector(0, 0, 'zero2', 1),
		];
		const originalData = [{}];

		const points = calculatePoints(vectors, X, originalData);

		// All zeros → projected point at origin
		expect(points[0].x).toBeCloseTo(0, TOLERANCE);
		expect(points[0].y).toBeCloseTo(0, TOLERANCE);
	});

	it('should return empty array for dimension mismatch', () => {
		const X = matrix([[1, 2, 3]]);
		const vectors = [
			buildCartesianVector(1, 0, 'a', 0),
			buildCartesianVector(0, 1, 'b', 1),
		];
		const originalData = [{}];

		// X has 3 columns but only 2 vectors → mismatch
		const points = calculatePoints(vectors, X, originalData);

		expect(points).toEqual([]);
	});

	it('should return empty array for null vectors', () => {
		const X = matrix([[1, 2]]);
		const originalData = [{}];

		const points = calculatePoints(null, X, originalData);

		expect(points).toEqual([]);
	});

	it('should handle single sample with single feature', () => {
		const X = matrix([[5]]);
		const vectors = [buildCartesianVector(0.6, 0.8, 'a', 0)];
		const originalData = [{}];

		const points = calculatePoints(vectors, X, originalData);

		// P = [5] · [0.6, 0.8] = [3, 4]
		expect(points[0].x).toBeCloseTo(3, TOLERANCE);
		expect(points[0].y).toBeCloseTo(4, TOLERANCE);
	});

	it('should calculate exact values for hand-computable case', () => {
		// Design a case where we can verify exact arithmetic
		// X = [[10, 20, 30]]
		// V₁ = (1, 0), V₂ = (0, 1), V₃ = (1, 1)
		// P = 10*(1,0) + 20*(0,1) + 30*(1,1) = (10,0) + (0,20) + (30,30) = (40, 50)

		const X = matrix([[10, 20, 30]]);
		const vectors = [
			buildCartesianVector(1, 0, 'v1', 0),
			buildCartesianVector(0, 1, 'v2', 1),
			buildCartesianVector(1, 1, 'v3', 2),
		];
		const originalData = [{}];

		const points = calculatePoints(vectors, X, originalData);

		expect(points[0].x).toBeCloseTo(40, TOLERANCE);
		expect(points[0].y).toBeCloseTo(50, TOLERANCE);
	});
});
