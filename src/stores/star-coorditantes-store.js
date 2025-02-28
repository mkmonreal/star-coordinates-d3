import { create } from 'zustand';
import { createRandomDataAndVectors } from '../datasets/random-data-init';

const [randomVectors] = createRandomDataAndVectors();

const useStarCoordinatesStore = create((set, get) => ({
	headers: [],
	originalData: [],
	processedData: [],
	vectors: randomVectors,
	setHeaders: (headers) => set({ headers }),
	setOriginalData: (originalData) => set({ originalData }),
	setProcessedData: (processedData) => set({ processedData }),
	hasOriginalData: () => get().originalData.size > 0,
	updateVector: (vector) => {
		const prevVectors = get().vectors;
		const newVectors = prevVectors.map((v) => (vector.id === v.id
			? vector : v));
		set({ vectors: newVectors });
	},
}));

export default useStarCoordinatesStore;
