import { Card, Flex, Radio, Select } from 'antd';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

const dimensionalityReductionOptions = Object.values(
	DimensionalityReductionEnum
).map((option) => ({
	label: option,
	value: option,
}));

const normalizationMethodOptions = Object.values(NormalizationMethodEnum).map(
	(option) => ({
		label: option,
		value: option,
	})
);

const AnalysisConfiguration = () => {
	const setVectorsInitialized = useConfigStore(
		(state) => state.setVectorsInitialized
	);
	const analysis = useConfigStore((state) => state.analysis);
	const setAnalysis = useConfigStore((state) => state.setAnalysis);
	const normalizationMethod = useConfigStore(
		(state) => state.normalizationMethod
	);
	const setNormalizationMethod = useConfigStore(
		(state) => state.setNormalizationMethod
	);

	const columns = useStarCoordinatesStore((state) => state.columns);
	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const setSelectedClassColumn = useStarCoordinatesStore(
		(state) => state.setSelectedClassColumn
	);

	return (
		<Flex vertical gap="middle">
			<Card title="Normalization method">
				<Radio.Group
					block
					value={normalizationMethod}
					options={normalizationMethodOptions}
					defaultValue={normalizationMethodOptions[0].value}
					optionType="button"
					buttonStyle="solid"
					onChange={(e) => {
						setNormalizationMethod(e.target.value);
					}}
				></Radio.Group>
			</Card>
			<Card title="Dimensionality reduction">
				<Flex gap="small" vertical>
					<Radio.Group
						block
						value={analysis}
						options={dimensionalityReductionOptions}
						defaultValue={dimensionalityReductionOptions[0].value}
						optionType="button"
						buttonStyle="solid"
						onChange={(e) => {
							setAnalysis(e.target.value);
							setVectorsInitialized(false);
						}}
					></Radio.Group>
					{DimensionalityReductionEnum.LDA === analysis ? (
						<Flex gap="small" align="center" justify="space-between">
							<h3>Class:</h3>
							<Select
								style={{ width: '100%' }}
								title="Class:"
								value={selectedClassColumn}
								onChange={(e) => {
									setSelectedClassColumn(e);
									setVectorsInitialized(false);
								}}
								placeholder="Select a column"
							>
								{columns?.map((column) => (
									<Select.Option key={column} value={column}>
										{column}
									</Select.Option>
								))}
							</Select>
						</Flex>
					) : null}
				</Flex>
			</Card>
		</Flex>
	);
};

export default AnalysisConfiguration;
