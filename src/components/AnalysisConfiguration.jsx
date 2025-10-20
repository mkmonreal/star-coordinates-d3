import { Card, Flex, InputNumber, Radio, Select } from 'antd';
import dimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import NormalizationMethodEnum from '../enums/normalization-method-enum';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';

const dimensionalityReductionOptions = Object.values(
	dimensionalityReductionStatisticalTechniquesEnum
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
	const analysis = useConfigStore((state) => state.analysis);
	const setAnalysis = useConfigStore((state) => state.setAnalysis);
	const normalizationMethod = useConfigStore(
		(state) => state.normalizationMethod
	);
	const setNormalizationMethod = useConfigStore(
		(state) => state.setNormalizationMethod
	);

	const columns = useStarCoordinatesStore((state) => state.columns);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const setSelectedClassColumn = useStarCoordinatesStore(
		(state) => state.setSelectedClassColumn
	);

	const numArrows = useConfigStore((state) => state.numArrows);
	const setNumArrows = useConfigStore((state) => state.setNumArrows);

	function onChangeNumArrows(value) {
		if (!value) {
			return;
		}

		setNumArrows(value);
	}

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
						console.log(e);
						setNormalizationMethod(e.target.value);
					}}
					disabled={
						DimensionalityReductionStatisticalTechniquesEnum.PCA === analysis ||
						DimensionalityReductionStatisticalTechniquesEnum.LDA === analysis
					}
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
							const value = e.target.value;
							if (
								DimensionalityReductionStatisticalTechniquesEnum.PCA ===
									value ||
								DimensionalityReductionStatisticalTechniquesEnum.LDA === value
							) {
								setNormalizationMethod(NormalizationMethodEnum.Z_SCORE);
							}
							setAnalysis(value);
						}}
					></Radio.Group>
					{dimensionalityReductionStatisticalTechniquesEnum.LDA === analysis ? (
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
					) : null}
					{dimensionalityReductionStatisticalTechniquesEnum.PCA === analysis ||
					dimensionalityReductionStatisticalTechniquesEnum.LDA === analysis ? (
						<Flex gap="small" align="center" justify="space-between">
							<h3>Number of arrows:</h3>
							<InputNumber
								min={0}
								defaultValue={numArrows}
								onChange={onChangeNumArrows}
							/>
						</Flex>
					) : null}
				</Flex>
			</Card>
		</Flex>
	);
};

export default AnalysisConfiguration;
