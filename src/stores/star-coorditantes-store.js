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

import { create } from 'zustand';

const useStarCoordinatesStore = create((set, get) => ({
	vectors: [],
	columns: [],
	validColumns: [],
	selectedColumns: [],
	originalData: [],
	selectedClassColumn: null,
	classes: new Set(),
	eigenDecomposition: [],
	setVectors: (vectors) => set({ vectors }),
	setColumns: (columns) => set({ columns }),
	setValidColumns: (validColumns) => set({ validColumns }),
	setSelectedColumns: (selectedColumns) => set({ selectedColumns }),
	addSelectedColumn: (selectedColumn) =>
		set({ selectedColumns: [...get().selectedColumns, selectedColumn] }),
	removeSelectedColumn: (selectedColumn) =>
		set({
			selectedColumns: get().selectedColumns.filter(
				(column) => column !== selectedColumn
			),
		}),
	setOriginalData: (originalData) => set({ originalData }),
	setSelectedClassColumn: (selectedClassColumn) => set({ selectedClassColumn }),
	setClasses: (classes) => set({ classes }),
	setEigenDecomposition: (eigenDecomposition) => set({ eigenDecomposition }),
}));

export default useStarCoordinatesStore;
