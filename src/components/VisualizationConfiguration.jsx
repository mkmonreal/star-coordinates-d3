import { Card, ColorPicker, Flex, Select } from 'antd';
import ColorsetEnum from '../enums/colorset-enum';
import useD3ColorScale from '../hooks/useD3ColorScale';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

const DEFAULT_COLOR = '#FFA500';

const colorsetOptions = Object.values(ColorsetEnum).map((colorset) => ({
	label: colorset.name,
	value: colorset,
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
		</Flex>
	);
}

export default VisualizationConfiguration;
