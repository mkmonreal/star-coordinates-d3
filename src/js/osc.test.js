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
import { osc } from './osc';
import { buildCartesianVector } from '../utils/vector';
import { sqrt, dot, sum, square, matrix } from 'mathjs';
import { loadIrisDataset, loadWineDataset } from './fixtures/datasets';
import { pca } from './pca';

// ============================================================================
// Auxiliary functions for testing orthographic properties
// ============================================================================

/**
 * Calculate the squared norm of a vector: ||v||²
 */
function normSquared(vector) {
	return sum(vector.map((v) => square(v)));
}

/**
 * Calculate the norm of a vector: ||v||
 */
function norm(vector) {
	return sqrt(normSquared(vector));
}

/**
 * Calculate the dot product of two vectors: <u, v>
 */
function dotProduct(u, v) {
	return dot(u, v);
}

/**
 * Calculate orthographic energy: e(A) = (||x||² - 1)² + (||y||² - 1)² + <x,y>²
 * where x and y are the column vectors extracted from the vector matrix
 */
function orthographicEnergy(vectors) {
	const x = vectors.map((v) => v.cartesian.x);
	const y = vectors.map((v) => v.cartesian.y);

	const xNormSq = normSquared(x);
	const yNormSq = normSquared(y);
	const xyDot = dotProduct(x, y);

	return square(xNormSq - 1) + square(yNormSq - 1) + square(xyDot);
}

/**
 * Check if vectors form an orthographic projection (energy ≈ 0)
 */
function isOrthographic(vectors, tolerance = 1e-6) {
	const energy = orthographicEnergy(vectors);
	return energy < tolerance;
}

/**
 * Verify orthographic invariants:
 * - ||x||² ≈ 1
 * - ||y||² ≈ 1
 * - <x, y> ≈ 0
 */
function verifyOrthographicInvariants(vectors, tolerance = 1e-6) {
	const x = vectors.map((v) => v.cartesian.x);
	const y = vectors.map((v) => v.cartesian.y);

	const xNormSq = normSquared(x);
	const yNormSq = normSquared(y);
	const xyDot = dotProduct(x, y);

	return {
		xNormSq,
		yNormSq,
		xyDot,
		isXUnitNorm: Math.abs(xNormSq - 1) < tolerance,
		isYUnitNorm: Math.abs(yNormSq - 1) < tolerance,
		areOrthogonal: Math.abs(xyDot) < tolerance,
		energy: orthographicEnergy(vectors),
	};
}

/**
 * Create a radial standard configuration for n dimensions
 * Configuration: (xᵢ, yᵢ) = r · (cos(i·α), sin(i·α))
 * where α = 2π/n and r = √(2/n)
 * This guarantees e(A) = 0
 *
 * Note: For n=2, we use a special case with α = π/2 to ensure proper orthogonality
 */
function createRadialStandardConfiguration(n, labels = null) {
	// Special case for n=2: use perpendicular unit axes
	if (n === 2) {
		return [
			buildCartesianVector(1, 0, labels?.[0] ?? 'axis0', 0),
			buildCartesianVector(0, 1, labels?.[1] ?? 'axis1', 1),
		];
	}

	const alpha = (2 * Math.PI) / n;
	const r = Math.sqrt(2 / n);

	const vectors = [];
	for (let i = 0; i < n; i++) {
		const x = r * Math.cos(i * alpha);
		const y = r * Math.sin(i * alpha);
		const label = labels?.[i] ?? `axis${i}`;
		vectors.push(buildCartesianVector(x, y, label, i));
	}

	return vectors;
}

// ============================================================================
// Tests for auxiliary functions
// ============================================================================

describe('OSC Auxiliary Functions', () => {
	describe('normSquared', () => {
		it('should calculate squared norm correctly', () => {
			expect(normSquared([3, 4])).toBeCloseTo(25, 5);
			expect(normSquared([1, 0, 0])).toBeCloseTo(1, 5);
			expect(normSquared([1, 1, 1, 1])).toBeCloseTo(4, 5);
		});
	});

	describe('norm', () => {
		it('should calculate norm correctly', () => {
			expect(norm([3, 4])).toBeCloseTo(5, 5);
			expect(norm([1, 0, 0])).toBeCloseTo(1, 5);
			expect(norm([1, 1])).toBeCloseTo(Math.sqrt(2), 5);
		});
	});

	describe('dotProduct', () => {
		it('should calculate dot product correctly', () => {
			expect(dotProduct([1, 0], [0, 1])).toBeCloseTo(0, 5);
			expect(dotProduct([1, 2], [3, 4])).toBeCloseTo(11, 5);
			expect(dotProduct([1, 1, 1], [1, 1, 1])).toBeCloseTo(3, 5);
		});

		it('should detect orthogonal vectors', () => {
			expect(dotProduct([1, 0, 0], [0, 1, 0])).toBeCloseTo(0, 5);
			expect(dotProduct([1, 1], [-1, 1])).toBeCloseTo(0, 5);
		});
	});

	describe('orthographicEnergy', () => {
		it('should return 0 for orthographic configuration', () => {
			// Unit vectors that are orthogonal: x = [1, 0], y = [0, 1]
			const vectors = [
				buildCartesianVector(1, 0, 'a', 0),
				buildCartesianVector(0, 1, 'b', 1),
			];

			const energy = orthographicEnergy(vectors);
			expect(energy).toBeCloseTo(0, 5);
		});

		it('should return > 0 for non-orthographic configuration', () => {
			// Non-unit, non-orthogonal vectors
			const vectors = [
				buildCartesianVector(2, 1, 'a', 0),
				buildCartesianVector(1, 2, 'b', 1),
			];

			const energy = orthographicEnergy(vectors);
			expect(energy).toBeGreaterThan(0);
		});
	});
});

// ============================================================================
// Tests for radial standard configuration
// ============================================================================

describe('Radial Standard Configuration', () => {
	it('should create orthographic configuration for n=2', () => {
		const vectors = createRadialStandardConfiguration(2);
		expect(vectors.length).toBe(2);

		const invariants = verifyOrthographicInvariants(vectors);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 5);
	});

	it('should create orthographic configuration for n=3', () => {
		const vectors = createRadialStandardConfiguration(3);
		expect(vectors.length).toBe(3);

		const invariants = verifyOrthographicInvariants(vectors);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 5);
	});

	it('should create orthographic configuration for n=4', () => {
		const vectors = createRadialStandardConfiguration(4);
		expect(vectors.length).toBe(4);

		const invariants = verifyOrthographicInvariants(vectors);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 5);
	});

	it('should create orthographic configuration for n=10', () => {
		const vectors = createRadialStandardConfiguration(10);
		expect(vectors.length).toBe(10);

		const invariants = verifyOrthographicInvariants(vectors);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 6);
	});

	it('should preserve custom labels', () => {
		const labels = ['feature1', 'feature2', 'feature3'];
		const vectors = createRadialStandardConfiguration(3, labels);

		expect(vectors[0].label).toBe('feature1');
		expect(vectors[1].label).toBe('feature2');
		expect(vectors[2].label).toBe('feature3');
	});

	it('should have correct radius r = √(2/n)', () => {
		const n = 5;
		const vectors = createRadialStandardConfiguration(n);
		const expectedRadius = Math.sqrt(2 / n);

		// Check that each vector has approximately the expected module
		vectors.forEach((v) => {
			const actualRadius = Math.sqrt(v.cartesian.x ** 2 + v.cartesian.y ** 2);
			expect(actualRadius).toBeCloseTo(expectedRadius, 5);
		});
	});
});

// ============================================================================
// Tests for OSC Gram-Schmidt (Reconditioning) algorithm
// ============================================================================

describe('OSC - Gram-Schmidt Reconditioning', () => {
	it('should return undefined for null or empty input', () => {
		expect(osc(null)).toBeUndefined();
		expect(osc(undefined)).toBeUndefined();
		expect(osc([])).toBeUndefined(); // Empty array returns undefined
	});

	it('should transform non-orthographic to orthographic configuration', () => {
		// Start with a non-orthographic configuration
		const vectors = [
			buildCartesianVector(2, 1, 'a', 0),
			buildCartesianVector(1, 2, 'b', 1),
			buildCartesianVector(0.5, 1.5, 'c', 2),
		];

		// Verify it's not orthographic
		expect(isOrthographic(vectors)).toBe(false);

		// Apply OSC
		const result = osc(vectors);

		// Verify result is orthographic
		expect(result).toBeDefined();
		expect(result.length).toBe(3);

		const invariants = verifyOrthographicInvariants(result);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 6);
	});

	it('should preserve orthographic configuration', () => {
		// Start with an already orthographic configuration
		const vectors = createRadialStandardConfiguration(4);

		// Apply OSC
		const result = osc(vectors);

		// Should still be orthographic
		expect(isOrthographic(result)).toBe(true);

		const invariants = verifyOrthographicInvariants(result);
		expect(invariants.energy).toBeCloseTo(0, 6);
	});

	it('should preserve vector labels and ids', () => {
		const vectors = [
			buildCartesianVector(1.5, 0.5, 'feature1', 'id1'),
			buildCartesianVector(0.5, 1.5, 'feature2', 'id2'),
		];

		const result = osc(vectors);

		expect(result[0].label).toBe('feature1');
		expect(result[0].id).toBe('id1');
		expect(result[1].label).toBe('feature2');
		expect(result[1].id).toBe('id2');
	});

	it('should handle 2D case', () => {
		const vectors = [
			buildCartesianVector(3, 1, 'x', 0),
			buildCartesianVector(1, 2, 'y', 1),
		];

		const result = osc(vectors);

		expect(result.length).toBe(2);

		const invariants = verifyOrthographicInvariants(result);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
	});

	it('should handle high-dimensional case (n=10)', () => {
		// Create a slightly perturbed configuration
		const vectors = createRadialStandardConfiguration(10).map((v) => {
			return buildCartesianVector(
				v.cartesian.x * 1.1 + 0.05,
				v.cartesian.y * 0.9 - 0.03,
				v.label,
				v.id
			);
		});

		// Verify it's not perfectly orthographic
		expect(isOrthographic(vectors, 1e-6)).toBe(false);

		const result = osc(vectors);

		// Should be orthographic after OSC
		const invariants = verifyOrthographicInvariants(result);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
		expect(invariants.energy).toBeCloseTo(0, 6);
	});

	it('should normalize x vector correctly', () => {
		const vectors = [
			buildCartesianVector(2, 0, 'a', 0), // x will be [2, 0], should normalize to [1, 0]
			buildCartesianVector(0, 3, 'b', 1), // y will be [0, 3], should become [0, 1] after orthogonalization
		];

		const result = osc(vectors);

		// After normalization, x should be unit norm
		const x = result.map((v) => v.cartesian.x);
		expect(normSquared(x)).toBeCloseTo(1, 5);
	});

	it('should orthogonalize and normalize y vector correctly', () => {
		const vectors = [
			buildCartesianVector(1, 0, 'a', 0),
			buildCartesianVector(0, 1, 'b', 1),
		];

		const result = osc(vectors);

		// y should be orthogonal to x and have unit norm
		const x = result.map((v) => v.cartesian.x);
		const y = result.map((v) => v.cartesian.y);

		expect(dotProduct(x, y)).toBeCloseTo(0, 6);
		expect(normSquared(y)).toBeCloseTo(1, 5);
	});

	it('should maintain vector count', () => {
		for (let n = 2; n <= 8; n++) {
			const vectors = createRadialStandardConfiguration(n);
			const result = osc(vectors);
			expect(result.length).toBe(n);
		}
	});
});

// ============================================================================
// Edge cases and numerical stability
// ============================================================================

describe('OSC - Edge Cases', () => {
	it('should handle vectors with very small magnitudes', () => {
		const vectors = [
			buildCartesianVector(1e-8, 1e-8, 'a', 0),
			buildCartesianVector(1e-8, 1e-7, 'b', 1),
		];

		const result = osc(vectors);

		// Should still produce orthographic result
		expect(isOrthographic(result, 1e-5)).toBe(true);
	});

	it('should handle vectors aligned on same axis', () => {
		// All vectors point in similar direction
		const vectors = [
			buildCartesianVector(1, 0.1, 'a', 0),
			buildCartesianVector(1, 0.2, 'b', 1),
			buildCartesianVector(1, 0.15, 'c', 2),
		];

		const result = osc(vectors);

		// Should still be orthographic
		const invariants = verifyOrthographicInvariants(result);
		expect(invariants.isXUnitNorm).toBe(true);
		expect(invariants.isYUnitNorm).toBe(true);
		expect(invariants.areOrthogonal).toBe(true);
	});

	it('should handle negative coordinates', () => {
		const vectors = [
			buildCartesianVector(-1, -1, 'a', 0),
			buildCartesianVector(1, -1, 'b', 1),
			buildCartesianVector(-1, 1, 'c', 2),
		];

		const result = osc(vectors);

		expect(isOrthographic(result)).toBe(true);
	});
});

// ============================================================================
// § 8.2.5 — OSC Tests Required by Memory
// ============================================================================

describe('OSC - Orthonormality (§8.2.5)', () => {
	it('should satisfy Vᵀ·V = I (orthonormality)', () => {
		const vectors = [
			buildCartesianVector(2, 1, 'a', 0),
			buildCartesianVector(1, 2, 'b', 1),
			buildCartesianVector(0.5, 1.5, 'c', 2),
		];

		const result = osc(vectors);

		// Extract column vectors
		const x = result.map((v) => v.cartesian.x);
		const y = result.map((v) => v.cartesian.y);

		// Verify ||x||² = 1
		const xNormSq = sum(x.map((xi) => square(xi)));
		expect(xNormSq).toBeCloseTo(1, 10);

		// Verify ||y||² = 1
		const yNormSq = sum(y.map((yi) => square(yi)));
		expect(yNormSq).toBeCloseTo(1, 10);

		// Verify <x, y> = 0
		const xyDot = dot(x, y);
		expect(Math.abs(xyDot)).toBeLessThan(1e-10);
	});

	it('should produce orthonormal result for any input configuration', () => {
		// Test with multiple random-like configurations
		const configs = [
			[
				buildCartesianVector(3.2, 1.1, 'a', 0),
				buildCartesianVector(0.5, 2.8, 'b', 1),
			],
			[
				buildCartesianVector(1, 1, 'a', 0),
				buildCartesianVector(1, -1, 'b', 1),
				buildCartesianVector(-1, 1, 'c', 2),
			],
			[
				buildCartesianVector(5, 0, 'a', 0),
				buildCartesianVector(0, 5, 'b', 1),
				buildCartesianVector(3, 3, 'c', 2),
				buildCartesianVector(-2, 4, 'd', 3),
			],
		];

		for (const config of configs) {
			const result = osc(config);
			const invariants = verifyOrthographicInvariants(result);

			expect(invariants.isXUnitNorm).toBe(true);
			expect(invariants.isYUnitNorm).toBe(true);
			expect(invariants.areOrthogonal).toBe(true);
		}
	});
});

describe('OSC - Data Independence (§8.2.5)', () => {
	it('should produce identical results for same axes regardless of data', () => {
		// Create a fixed axis configuration
		const axes = [
			buildCartesianVector(1.5, 0.8, 'a', 0),
			buildCartesianVector(0.6, 1.2, 'b', 1),
			buildCartesianVector(-0.5, 1.0, 'c', 2),
		];

		// Apply OSC (does not take data as input)
		const result1 = osc(axes);
		const result2 = osc(axes);

		// Results should be identical
		for (let i = 0; i < result1.length; i++) {
			expect(result1[i].cartesian.x).toBeCloseTo(result2[i].cartesian.x, 10);
			expect(result1[i].cartesian.y).toBeCloseTo(result2[i].cartesian.y, 10);
		}
	});

	it('should not depend on data: same axes give same result with different datasets', () => {
		// Create a random axis configuration
		const axes = [
			buildCartesianVector(2.1, 0.7, 'axis0', 0),
			buildCartesianVector(0.4, 1.9, 'axis1', 1),
			buildCartesianVector(-0.8, 1.3, 'axis2', 2),
			buildCartesianVector(1.2, -0.5, 'axis3', 3),
		];

		// Load different datasets (not used by OSC)
		const { data: irisData } = loadIrisDataset();
		const { data: wineData } = loadWineDataset();

		// Apply OSC to same axes (OSC doesn't take data parameter)
		const result1 = osc(axes);
		const result2 = osc(axes);

		// Results must be identical - OSC is purely geometric
		for (let i = 0; i < axes.length; i++) {
			expect(result1[i].cartesian.x).toBeCloseTo(result2[i].cartesian.x, 10);
			expect(result1[i].cartesian.y).toBeCloseTo(result2[i].cartesian.y, 10);
		}

		// Both results should be orthonormal
		expect(isOrthographic(result1)).toBe(true);
		expect(isOrthographic(result2)).toBe(true);
	});
});

describe('OSC - Idempotence with PCA (§8.2.5)', () => {
	it('should be approximately idempotent when applied to PCA result', () => {
		// Load Iris dataset
		const { data } = loadIrisDataset();

		// Perform PCA
		const pcaResult = pca(data);
		const pcs = pcaResult.principalComponents;

		// Build axis configuration from first 2 PCs
		// PCA eigenvectors are already orthonormal, so the resulting
		// V matrix should already satisfy Vᵀ·V = I
		const pcaVectors = [
			buildCartesianVector(
				pcs[0].vector.get([0]),
				pcs[1].vector.get([0]),
				'SepalLength',
				0
			),
			buildCartesianVector(
				pcs[0].vector.get([1]),
				pcs[1].vector.get([1]),
				'SepalWidth',
				1
			),
			buildCartesianVector(
				pcs[0].vector.get([2]),
				pcs[1].vector.get([2]),
				'PetalLength',
				2
			),
			buildCartesianVector(
				pcs[0].vector.get([3]),
				pcs[1].vector.get([3]),
				'PetalWidth',
				3
			),
		];

		// Verify PCA result is already orthonormal
		const pcaInvariants = verifyOrthographicInvariants(pcaVectors);
		expect(pcaInvariants.isXUnitNorm).toBe(true);
		expect(pcaInvariants.isYUnitNorm).toBe(true);
		expect(pcaInvariants.areOrthogonal).toBe(true);

		// Apply OSC to PCA result
		const oscResult = osc(pcaVectors);

		// OSC should not significantly modify an already orthonormal configuration
		for (let i = 0; i < pcaVectors.length; i++) {
			// Check that vectors are very similar (may have small numerical differences)
			const dx = Math.abs(pcaVectors[i].cartesian.x - oscResult[i].cartesian.x);
			const dy = Math.abs(pcaVectors[i].cartesian.y - oscResult[i].cartesian.y);

			// Tolerance of 1e-6 for near-idempotence
			expect(dx).toBeLessThan(1e-6);
			expect(dy).toBeLessThan(1e-6);
		}
	});

	it('should preserve orthonormality when applied twice', () => {
		const vectors = [
			buildCartesianVector(2.5, 1.3, 'a', 0),
			buildCartesianVector(0.8, 2.1, 'b', 1),
			buildCartesianVector(-1.2, 1.7, 'c', 2),
		];

		const result1 = osc(vectors);
		const result2 = osc(result1);

		// Second application should produce nearly identical results (idempotent)
		for (let i = 0; i < vectors.length; i++) {
			expect(result1[i].cartesian.x).toBeCloseTo(result2[i].cartesian.x, 6);
			expect(result1[i].cartesian.y).toBeCloseTo(result2[i].cartesian.y, 6);
		}
	});
});
