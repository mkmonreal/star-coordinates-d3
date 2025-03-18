import { create } from 'zustand';

const useConfigStore = create((set) => ({
	idColumn: '',
	unitCircleRadius: 150,
	selectedVectors: [],
	radius: 4,
	fill: 'lightsalmon',
	stroke: 'salmon',
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setRadius: (radius) => set({ radius }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
}));

export default useConfigStore;
