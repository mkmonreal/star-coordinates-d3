//    Copyright (C) 2025-2026 Miguel Ángel Monreal Velasco
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Tabs } from 'antd';
import AnalysisConfiguration from './AnalysisConfiguration';
import ColumnsConfiguration from './ColumnsConfiguration';
import VisualizationConfiguration from './VisualizationConfiguration';

function Configuration() {
	return (
		<Tabs
			defaultActiveKey="column-config"
			items={[
				{
					label: 'Columns configuration',
					key: 'column-config',
					children: <ColumnsConfiguration />,
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

Configuration.propTypes = {};

export default Configuration;
