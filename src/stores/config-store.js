//    Copyright 2025 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { create } from 'zustand';
import { orange, volcano } from '@ant-design/colors';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import ColorsetEnum from '../enums/colorset-enum';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';

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
	vectorsInitialized: false,
	vectorVisualization: VectorNameVisualizationEnum.ALWAYS,
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
	setVectorsInitialized: (vectorsInitialized) => set({ vectorsInitialized }),
	setVectorVisualization: (vectorVisualization) => set({ vectorVisualization }),
}));

export default useConfigStore;
