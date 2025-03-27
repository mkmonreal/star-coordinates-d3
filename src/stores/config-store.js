import { create } from 'zustand';
import { orange, volcano } from '@ant-design/colors';
import dimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';

const useConfigStore = create((set) => ({
	idColumn: '',
	unitCircleRadius: 150,
	selectedVectors: [],
	radius: 4,
	fill: orange.primary,
	stroke: volcano.primary,
	normalizationMethod: NormalizationMethodEnum.MIN_MAX,
	analysis: dimensionalityReductionStatisticalTechniquesEnum.NONE,
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setRadius: (radius) => set({ radius }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
	setNormalizationMethod: (normalizationMethod) => set({ normalizationMethod }),
	setAnalysis: (analysis) => set({ analysis }),
}));

export default useConfigStore;
