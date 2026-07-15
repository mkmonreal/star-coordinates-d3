//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { create } from 'zustand';
import { orange, volcano } from '@ant-design/colors';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import ColorsetEnum from '../enums/colorset-enum';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';

const useConfigStore = create((set) => ({
	idColumn: 'scIdColumn',
	unitCircleRadius: 150,
	selectedVectors: [],
	className: null,
	radius: 4,
	opacity: 0.65,
	fill: orange.primary,
	stroke: volcano.primary,
	colorset: ColorsetEnum.VIRIDIS,
	normalizationMethod: NormalizationMethodEnum.MIN_MAX,
	analysis: DimensionalityReductionEnum.NONE,
	vectorsInitialized: false,
	vectorVisualization: VectorNameVisualizationEnum.ALWAYS,
	selectionMode: false,
	selectedPointIds: new Set(),
	setIdColumn: (idColumn) => set({ idColumn }),
	setUnitCircleRadius: (unitCircleRadius) => set({ unitCircleRadius }),
	setSelectedVectors: (selectedVectors) => set({ selectedVectors }),
	setClassName: (className) => set({ className }),
	setRadius: (radius) => set({ radius }),
	setOpacity: (opacity) => set({ opacity }),
	setFill: (fill) => set({ fill }),
	setStroke: (stroke) => set({ stroke }),
	setColorset: (colorset) => set({ colorset }),
	setNormalizationMethod: (normalizationMethod) => set({ normalizationMethod }),
	setAnalysis: (analysis) => set({ analysis }),
	setVectorsInitialized: (vectorsInitialized) => set({ vectorsInitialized }),
	setVectorVisualization: (vectorVisualization) => set({ vectorVisualization }),
	setSelectionMode: (selectionMode) => set({ selectionMode }),
	setSelectedPointIds: (selectedPointIds) => set({ selectedPointIds }),
	clearSelectedPoints: () => set({ selectedPointIds: new Set() }),
}));

export default useConfigStore;
