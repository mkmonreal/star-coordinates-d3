import { create } from 'zustand';

const useStarCoordinatesStore = create((set, get) => ({
	columns: [],
	validColumns: [],
	selectedColumns: [],
	originalData: [],
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
}));

export default useStarCoordinatesStore;
