import ColumnsConfiguration from './ColumnsConfiguration';
import AnalysisConfiguration from './AnalysisConfiguration';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';

function Configuration({ idColumn }) {
	return (
		<Tabs
			defaultActiveKey="column-config"
			items={[
				{
					label: 'Columns configuration',
					key: 'column-config',
					children: <ColumnsConfiguration idColumn={idColumn} />,
				},
				{
					label: 'Analysis configuration',
					key: 'analysis-config',
					children: <AnalysisConfiguration />,
				},
			]}
		/>
	);
}

Configuration.propTypes = {
	idColumn: PropTypes.string.isRequired,
};

export default Configuration;
