import { create } from 'zustand';
import { orange, volcano } from '@ant-design/colors';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import ColorsetEnum from '../enums/colorset-enum';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';

const useConfigStore = create((set) => ({
	idColumn: '',
	unitCircleRadius: 150,
	selectedVectors: [],
	className: null,
	radius: 4,
	fill: orange.primary,
	stroke: volcano.primary,
	colorset: ColorsetEnum.VIRIDIS,
	normalizationMethod: NormalizationMethodEnum.MIN_MAX,
	analysis: DimensionalityReductionEnum.NONE,
	numArrows: 3,
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setClassName: (className) => set({ className }),
	setRadius: (radius) => set({ radius }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
	setColorset: (colorset) => set({ colorset }),
	setNormalizationMethod: (normalizationMethod) => set({ normalizationMethod }),
	setAnalysis: (analysis) => set({ analysis }),
	setNumArrows: (numArrows) => set({ numArrows }),
}));

export default useConfigStore;
