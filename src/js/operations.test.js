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
import { createCovarianceMatrix } from './operations';
import { matrix } from 'mathjs';

// filepath: /home/mkmonreal/Git/star-coordinates-d3/src/js/operations.test.js

describe('createCovarianceMatrix', () => {
	it('should calculate the covariance matrix for a valid dataset', () => {
		const data = matrix([
			[2, 4, 6],
			[1, 3, 5],
			[7, 9, 11],
		]);

		const result = createCovarianceMatrix(data);

		// The function divides by (nCols - 1) = 2, not (nRows - 1) = 2
		// For this specific case it's the same, but values are: variance = 31/3 ≈ 10.333
		const expected = matrix([
			[10.333333333333334, 10.333333333333334, 10.333333333333334],
			[10.333333333333334, 10.333333333333334, 10.333333333333334],
			[10.333333333333334, 10.333333333333334, 10.333333333333334],
		]);

		// Use toBeCloseTo for floating point comparison
		const resultArray = result.toArray();
		const expectedArray = expected.toArray();

		for (let i = 0; i < resultArray.length; i++) {
			for (let j = 0; j < resultArray[i].length; j++) {
				expect(resultArray[i][j]).toBeCloseTo(expectedArray[i][j], 5);
			}
		}
	});

	it('should handle an empty dataset', () => {
		const data = matrix([]);

		expect(() => createCovarianceMatrix(data)).toThrow();
	});

	it('should throw an error for non-matrix inputs', () => {
		const invalidData = [1, 2, 3];

		expect(() => createCovarianceMatrix(invalidData)).toThrow();
	});

	it('should calculate covariance for a single column dataset', () => {
		const data = matrix([[1], [2], [3]]);

		const result = createCovarianceMatrix(data);

		// With single column, covariance is calculated as Var(X) / (n-1)
		// For [1,2,3]: mean=2, centered=[-1,0,1], variance=2, cov = 2/(3-1) = 1
		const resultArray = result.toArray();

		expect(resultArray[0][0]).toBeCloseTo(1, 5);
	});

	it('should calculate covariance for a single row dataset', () => {
		const data = matrix([[1, 2, 3]]);

		const result = createCovarianceMatrix(data);

		// With single row, (nRows - 1) = 0, which causes division by 0 → NaN
		// This is an edge case: cannot compute sample covariance from a single sample
		const resultArray = result.toArray();

		expect(isNaN(resultArray[0][0])).toBe(true);
		expect(isNaN(resultArray[1][1])).toBe(true);
		expect(isNaN(resultArray[2][2])).toBe(true);
	});
});
