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

import { readFileSync } from 'fs';
import { join } from 'path';
import { matrix } from 'mathjs';
import parseCsv from '../csv-parser';

const DATASETS_PATH = 'public/datasets';

/**
 * Load and parse Iris dataset
 * Returns: { data: matrix (150 x 4), labels: array of species, columns: array of column names }
 */
export function loadIrisDataset() {
	const filePath = join(DATASETS_PATH, 'Iris.csv');
	const content = readFileSync(filePath, 'utf-8');
	const parsed = parseCsv(content);

	// Iris has: Id, SepalLengthCm, SepalWidthCm, PetalLengthCm, PetalWidthCm, Species
	const numericColumns = [
		'SepalLengthCm',
		'SepalWidthCm',
		'PetalLengthCm',
		'PetalWidthCm',
	];

	const dataArray = parsed.map((row) =>
		numericColumns.map((col) => parseFloat(row[col]))
	);

	const labels = parsed.map((row) => row.Species);

	return {
		data: matrix(dataArray),
		labels,
		columns: numericColumns,
		classColumn: 'Species',
	};
}

/**
 * Load and parse Wine dataset
 * Returns: { data: matrix (178 x 13), labels: array of class, columns: array of column names }
 */
export function loadWineDataset() {
	const filePath = join(DATASETS_PATH, 'Wine dataset.csv');
	const content = readFileSync(filePath, 'utf-8');
	const parsed = parseCsv(content);

	// Wine has: class, Alcohol, Malic acid, ..., Proline (13 numeric features)
	const numericColumns = parsed.columns.filter((col) => col !== 'class');

	const dataArray = parsed.map((row) =>
		numericColumns.map((col) => parseFloat(row[col]))
	);

	const labels = parsed.map((row) => row.class);

	return {
		data: matrix(dataArray),
		labels,
		columns: numericColumns,
		classColumn: 'class',
	};
}

/**
 * Create class index map from labels (for LDA)
 * Returns Map: className -> [indices]
 */
export function createClassIndexMap(labels) {
	const map = new Map();

	labels.forEach((label, index) => {
		if (!map.has(label)) {
			map.set(label, []);
		}
		map.get(label).push(index);
	});

	return map;
}
