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

import { Card, ColorPicker, Flex, Select, Radio } from 'antd';
import ColorsetEnum from '../enums/colorset-enum';
import useD3ColorScale from '../hooks/useD3ColorScale';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import VectorNameVisualizationEnum from '../enums/vector-name-visualizaton-enum';

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

function VisualizationConfiguration() {
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
				<Flex vertical>
					<span>Show vectors names</span>
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
				</Flex>
			</Card>
		</Flex>
	);
}

export default VisualizationConfiguration;
