import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import AnalysisConfiguration from './AnalysisConfiguration';
import ColumnsConfiguration from './ColumnsConfiguration';
import VisualizationConfiguration from './VisualizationConfiguration';

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
				{
					label: 'Visualization configuration',
					key: 'visualization-config',
					children: <VisualizationConfiguration />,
				},
			]}
		/>
	);
}

Configuration.propTypes = {
	idColumn: PropTypes.string.isRequired,
};

export default Configuration;
