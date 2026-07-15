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
