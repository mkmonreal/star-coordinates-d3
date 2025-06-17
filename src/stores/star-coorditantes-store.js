import { create } from 'zustand';

const useStarCoordinatesStore = create((set, get) => ({
	columns: [],
	validColumns: [],
	selectedColumns: [],
	originalData: [],
	selectedClassColumn: null,
	classes: new Set(),
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
}));

export default useStarCoordinatesStore;
