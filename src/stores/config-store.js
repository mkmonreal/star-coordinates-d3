import { create } from 'zustand';
import { orange, volcano } from '@ant-design/colors';
import dimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';

const useConfigStore = create((set) => ({
	idColumn: '',
	unitCircleRadius: 150,
	selectedVectors: [],
	radius: 4,
	fill: orange.primary,
	stroke: volcano.primary,
	analysis: dimensionalityReductionStatisticalTechniquesEnum.None,
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setRadius: (radius) => set({ radius }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
	setAnalysis: (analysis) => set({ analysis }),
}));

export default useConfigStore;
