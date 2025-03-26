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

		// Expected covariance matrix calculated manually
		const expected = matrix([
			[9, 9, 9],
			[9, 9, 9],
			[9, 9, 9],
		]);

		expect(result).toEqual(expected);
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

		// Expected covariance matrix for a single column
		const expected = matrix([[1]]);

		expect(result).toEqual(expected);
	});

	it('should calculate covariance for a single row dataset', () => {
		const data = matrix([[1, 2, 3]]);

		const result = createCovarianceMatrix(data);

		// Expected covariance matrix for a single row
		const expected = matrix([
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		]);

		expect(result).toEqual(expected);
	});
});
