import { Radio } from 'antd';
import useConfigStore from '../stores/config-store';
import dimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
import { useEffect, useState } from 'react';
import { Card } from 'antd';

const options = Object.values(
	dimensionalityReductionStatisticalTechniquesEnum
).map((option) => ({
	label: option,
	value: option,
}));

const AnalysisConfiguration = () => {
	const setAnalysis = useConfigStore((state) => state.setAnalysis);

	const [value, setValue] = useState(options[0].value);

	useEffect(() => {
		setAnalysis(value);
	}, [value, setAnalysis]);

	return (
		<>
			<Card title="Dimensionality reduction">
				<Radio.Group
					block
					value={value}
					options={options}
					defaultValue={options[0].value}
					optionType="button"
					buttonStyle="solid"
					onChange={(e) => setValue(e.target.value)}
				></Radio.Group>
			</Card>
		</>
	);
};

export default AnalysisConfiguration;
