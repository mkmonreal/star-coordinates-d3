import { Radio, Card, Flex, Select } from 'antd';
import useConfigStore from '../stores/config-store';
import dimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { useEffect, useState } from 'react';
import NormalizationMethodEnum from '../enums/normalization-method-enum';

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
	const setAnalysis = useConfigStore((state) => state.setAnalysis);
	const setNormalizationMethod = useConfigStore(
		(state) => state.setNormalizationMethod
	);

	const columns = useConfigStore((state) => state.columns);

	const [normalization, setNormalization] = useState(
		normalizationMethodOptions[0].value
	);
	const [dimensionalityReduction, setDimensionalityReduction] = useState(
		dimensionalityReductionOptions[0].value
	);

	useEffect(() => {
		setNormalizationMethod(normalization);
	}, [normalization, setNormalizationMethod]);

	useEffect(() => {
		setAnalysis(dimensionalityReduction);
	}, [dimensionalityReduction, setAnalysis]);

	return (
		<Flex vertical gap="middle">
			<Card title="Normalization method">
				<Radio.Group
					block
					value={normalization}
					options={normalizationMethodOptions}
					defaultValue={normalizationMethodOptions[0].value}
					optionType="button"
					buttonStyle="solid"
					onChange={(e) => setNormalization(e.target.value)}
				></Radio.Group>
			</Card>
			<Card title="Dimensionality reduction">
				<Flex gap="small" vertical>
					<Radio.Group
						block
						value={dimensionalityReduction}
						options={dimensionalityReductionOptions}
						defaultValue={dimensionalityReductionOptions[0].value}
						optionType="button"
						buttonStyle="solid"
						onChange={(e) => setDimensionalityReduction(e.target.value)}
					></Radio.Group>
					{dimensionalityReductionStatisticalTechniquesEnum.LDA ===
					dimensionalityReduction ? (
						<Flex gap="small" align="center">
							<h3>Class:</h3>
							<Select style={{ width: '100%' }} title="Class:">
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
