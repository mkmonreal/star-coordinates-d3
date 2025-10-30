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
