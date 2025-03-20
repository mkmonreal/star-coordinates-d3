import { create } from 'zustand';
import { orange, orangeDark, volcano } from '@ant-design/colors';

const useConfigStore = create((set) => ({
	idColumn: '',
	unitCircleRadius: 150,
	selectedVectors: [],
	radius: 4,
	fill: orange.primary,
	stroke: volcano.primary,
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setRadius: (radius) => set({ radius }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
}));

export default useConfigStore;
