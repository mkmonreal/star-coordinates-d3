import { create } from 'zustand';
import { createRandomDataAndVectors } from '../datasets/random-data-init';

const [data, randomVectors] = createRandomDataAndVectors();

const useStarCoordinatesStore = create((set, get) => ({
	originalData: data,
	processedData: [],
	vectors: randomVectors,
	setOriginalData: (originalData) => set({ originalData }),
	updateVector: (vector) => {
		const prevVectors = get().vectors;
		const newVectors = prevVectors.map((v) => (vector.id === v.id
			? vector : v));
		set({ vectors: newVectors });
	},
	setProcessedData: (processedData) => set({ processedData }),
}));

export default useStarCoordinatesStore;
