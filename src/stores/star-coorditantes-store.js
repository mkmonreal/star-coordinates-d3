import { create } from 'zustand';

const useStarCoordinatesStore = create((set, get) => ({
	headers: [],
	validHeaders: [],
	selectedHeaders: [],
	originalData: [],
	processedData: [],
	normalizedData: [],
	vectors: [],
	setHeaders: (headers) => set({ headers }),
	setValidHeaders: (validHeaders) => set({ validHeaders }),
	setSelectedHeaders: (selectedHeaders) => set({ selectedHeaders }),
	addSelectedHeader: (selectedHeader) =>
		set({ selectedHeaders: [...get().selectedHeaders, selectedHeader] }),
	removeSelectedHeader: (selectedHeader) =>
		set({
			selectedHeaders: get().selectedHeaders.filter(
				(header) => header !== selectedHeader
			),
		}),
	setOriginalData: (originalData) => set({ originalData }),
	setProcessedData: (processedData) => set({ processedData }),
	hasOriginalData: () => get().originalData.size > 0,
	setNormalizedData: (normalizedData) => set({ normalizedData }),
	setVectors: (vectors) => set({ vectors }),
	updateVector: (vector) => {
		const prevVectors = get().vectors;
		const newVectors = prevVectors.map((v) =>
			vector.id === v.id ? vector : v
		);
		set({ vectors: newVectors });
	},
}));

export default useStarCoordinatesStore;
