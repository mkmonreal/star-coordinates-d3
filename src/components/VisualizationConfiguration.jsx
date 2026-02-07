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

import { Card, ColorPicker, Flex, InputNumber, Radio, Select } from 'antd';
import { useState } from 'react';
import ColorsetEnum from '../enums/colorset-enum';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';
import VectorRepresentationEnum from '../enums/vetor-representation-enum';
import useD3ColorScale from '../hooks/useD3ColorScale';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { buildCartesianVector, buildPolarVector } from '../utils/vector';

const DEFAULT_COLOR = '#FFA500';

const colorsetOptions = Object.values(ColorsetEnum).map((colorset) => ({
	label: colorset.name,
	value: colorset,
}));

const vectorVisualizationOptions = Object.values(
	VectorNameVisualizationEnum
).map((vectorVisualization) => ({
	label: vectorVisualization.name,
	value: vectorVisualization.value,
}));

const vectorRepresentationOptions = Object.values(VectorRepresentationEnum).map(
	(vectorVisualizationOption) => ({
		label: vectorVisualizationOption,
		value: vectorVisualizationOption,
	})
);

function VisualizationConfiguration() {
	const vectors = useStarCoordinatesStore((state) => state.vectors);
	const setVectors = useStarCoordinatesStore((state) => state.setVectors);

	const columns = useStarCoordinatesStore((state) => state.columns);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const setSelectedClassColumn = useStarCoordinatesStore(
		(state) => state.setSelectedClassColumn
	);

	const setColorset = useConfigStore((state) => state.setColorset);
	const vectorVisualization = useConfigStore(
		(state) => state.vectorVisualization
	);

	const setVectorVisualization = useConfigStore(
		(state) => state.setVectorVisualization
	);

	const { classesSet, selectColor } = useD3ColorScale(selectedClassColumn);

	const [vectorRepresentation, setVectorRepresentation] = useState(
		VectorRepresentationEnum.CARTESIAN
	);

	const analysis = useConfigStore((state) => state.analysis);
	const setAnalysis = useConfigStore((state) => state.setAnalysis);

	return (
		<Flex vertical gap="middle">
			<Card title="Colors">
				<Flex vertical gap="middle">
					<Flex gap="small" align="center" justify="space-between">
						<h3>Class:</h3>
						<Select
							style={{ width: '100%' }}
							title="Class:"
							value={selectedClassColumn}
							onChange={setSelectedClassColumn}
							placeholder="Select a column"
						>
							{columns?.map((column) => (
								<Select.Option key={column} value={column}>
									{column}
								</Select.Option>
							))}
						</Select>
					</Flex>
					<Flex gap="small" align="center" justify="space-between">
						<h3>Colorset:</h3>
						<Select
							style={{ width: '100%' }}
							title="Class:"
							defaultValue={ColorsetEnum.VIRIDIS.name}
							onChange={(value) => {
								const newColorset = colorsetOptions.find(
									(option) => value === option.label
								);
								setColorset(newColorset.value);
							}}
						>
							{colorsetOptions?.map((colorset) => (
								<Select.Option key={colorset.label} value={colorset.label}>
									{colorset.label}
								</Select.Option>
							))}
						</Select>
					</Flex>
					{selectedClassColumn && (
						<Flex vertical gap="middle" style={{ width: '100%' }}>
							{Array.from(classesSet.values())
								.sort()
								.map((d) => (
									<Flex
										key={d}
										align="center"
										justify="space-between"
										style={{ width: '100%' }}
									>
										<span>{d}</span>
										<ColorPicker
											value={selectColor ? selectColor(d) : DEFAULT_COLOR}
											size="small"
											disabled
										/>
									</Flex>
								))}
						</Flex>
					)}
				</Flex>
			</Card>
			<Card title="Vectors configuration">
				<Flex vertical gap={16}>
					<Card type="inner" size="small" title="Show vectors names">
						<Radio.Group
							block
							value={vectorVisualization.value}
							options={vectorVisualizationOptions}
							defaultValue={vectorVisualizationOptions[0].value}
							optionType="button"
							buttonStyle="solid"
							onChange={(e) => {
								const newVectorVisualization = vectorVisualizationOptions.find(
									(option) => option.value === e.target.value
								);
								setVectorVisualization(newVectorVisualization);
							}}
						></Radio.Group>
					</Card>
					<Card type="inner" size="small" title="Vectors modification">
						<Flex vertical gap={12}>
							<Radio.Group
								block
								value={vectorRepresentation}
								options={vectorRepresentationOptions}
								defaultValue={VectorRepresentationEnum.CARTESIAN}
								optionType="button"
								buttonStyle="solid"
								onChange={(e) => {
									const newVectorRepresentationOption =
										vectorRepresentationOptions.find(
											(option) => e.target.value === option.value
										);
									setVectorRepresentation(newVectorRepresentationOption.value);
								}}
							></Radio.Group>
							<Flex vertical gap={8}>
								{vectors
									? vectors.map((vector) => (
											<Card
												key={vector.id}
												title={vector.label}
												type="inner"
												size="small"
											>
												{VectorRepresentationEnum.CARTESIAN ===
												vectorRepresentation ? (
													<Flex justify="space-around">
														<Flex align="center">
															<span>x:</span>
															<InputNumber
																step="0.01"
																value={vector.cartesian.x}
																onChange={(e) => {
																	if (!e) {
																		return;
																	}

																	const newVector = buildCartesianVector(
																		e,
																		vector.cartesian.y,
																		vector.label,
																		vector.id
																	);
																	const newVectors = vectors.map((vector) =>
																		newVector.id === vector.id
																			? newVector
																			: vector
																	);
																	setVectors(newVectors);

																	if (
																		DimensionalityReductionEnum.NONE !==
																		analysis
																	) {
																		setAnalysis(
																			DimensionalityReductionEnum.NONE
																		);
																	}
																}}
															/>
														</Flex>
														<Flex align="center">
															<span>y:</span>
															<InputNumber
																step="0.01"
																value={vector.cartesian.y}
																onChange={(e) => {
																	if (!e) {
																		return;
																	}

																	const newVector = buildCartesianVector(
																		vector.cartesian.x,
																		e,
																		vector.label,
																		vector.id
																	);
																	const newVectors = vectors.map((vector) =>
																		newVector.id === vector.id
																			? newVector
																			: vector
																	);
																	setVectors(newVectors);
																	if (
																		DimensionalityReductionEnum.NONE !==
																		analysis
																	) {
																		setAnalysis(
																			DimensionalityReductionEnum.NONE
																		);
																	}
																}}
															/>
														</Flex>
													</Flex>
												) : null}
												{VectorRepresentationEnum.POLAR ===
												vectorRepresentation ? (
													<Flex>
														<span>Module:</span>
														<InputNumber
															step="0.01"
															value={vector.polar.module}
															onChange={(e) => {
																if (!e) {
																	return;
																}

																const newVector = buildPolarVector(
																	e,
																	vector.polar.angle,
																	vector.label,
																	vector.id
																);
																const newVectors = vectors.map((vector) =>
																	newVector.id === vector.id
																		? newVector
																		: vector
																);
																setVectors(newVectors);
																if (
																	DimensionalityReductionEnum.NONE !== analysis
																) {
																	setAnalysis(DimensionalityReductionEnum.NONE);
																}
															}}
														/>
														<span>Angle:</span>
														<InputNumber
															value={vector.polar.angle}
															onChange={(e) => {
																if (!e) {
																	return;
																}

																const newVector = buildPolarVector(
																	vector.polar.module,
																	e,
																	vector.label,
																	vector.id
																);
																const newVectors = vectors.map((vector) =>
																	newVector.id === vector.id
																		? newVector
																		: vector
																);
																setVectors(newVectors);
																if (
																	DimensionalityReductionEnum.NONE !== analysis
																) {
																	setAnalysis(DimensionalityReductionEnum.NONE);
																}
															}}
														/>
													</Flex>
												) : null}
											</Card>
										))
									: null}
							</Flex>
						</Flex>
					</Card>
				</Flex>
			</Card>
		</Flex>
	);
}

export default VisualizationConfiguration;
