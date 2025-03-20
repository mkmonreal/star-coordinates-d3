import ColumnsConfiguration from './ColumnsConfiguration';
import { Tabs } from 'antd';

function Configuration({ idColumn }) {
	return (
		<>
			<Tabs
				defaultActiveKey="column-config"
				items={[
					{
						label: 'Columns configuration',
						key: 'column-config',
						children: <ColumnsConfiguration idColumn={idColumn} />,
					},
				]}
			/>
		</>
	);
}

export default Configuration;
