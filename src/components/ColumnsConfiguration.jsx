import { Checkbox } from 'antd';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { Flex } from 'antd';
import useConfigStore from '../stores/config-store';
import { Select } from 'antd';
import { useState } from 'react';

const onChange = (onCheck, onUncheck, e, column) => {
	if (e.target.checked) {
		onCheck(column);
	} else {
		onUncheck(column);
	}
};

function ColumnsConfiguration({ idColumn }) {
	const setIdColumn = useConfigStore((state) => state.setIdColumn);

	const validHeaders = useStarCoordinatesStore((state) => state.validHeaders);
	const selectedHeaders = useStarCoordinatesStore(
		(state) => state.selectedHeaders
	);
	const addSelectedHeader = useStarCoordinatesStore(
		(state) => state.addSelectedHeader
	);
	const removeSelectedHeader = useStarCoordinatesStore(
		(state) => state.removeSelectedHeader
	);

	const [showNotSelectedHeaders, setShowNotSelectedHeaders] = useState(false);

	const notSelectedHeaders = validHeaders.filter(
		(header) => !selectedHeaders.includes(header)
	);

	return (
		<>
			<Flex gap="large" vertical>
				<Flex gap="small" style={{ width: '100%' }}>
					<h3>Id column:</h3>
					{validHeaders && (
						<Select
							onChange={(value) => setIdColumn(value)}
							value={idColumn}
							style={{ flex: 1 }}
						>
							{validHeaders.map((header) => (
								<Select.Option key={header} value={header}>
									{header}
								</Select.Option>
							))}
						</Select>
					)}
				</Flex>
				<Flex gap="small" vertical>
					{selectedHeaders &&
						selectedHeaders
							.sort((columnA, columnB) => {
								return columnA.localeCompare(columnB);
							})
							.map((column) => (
								<Checkbox
									key={column}
									onChange={(e) =>
										onChange(addSelectedHeader, removeSelectedHeader, e, column)
									}
									checked={true}
								>
									{column}
								</Checkbox>
							))}
					{notSelectedHeaders && notSelectedHeaders.length > 0 && (
						<a
							onClick={() => setShowNotSelectedHeaders(!showNotSelectedHeaders)}
						>
							{showNotSelectedHeaders ? '-' : '+'} Not selected headers
						</a>
					)}

					{showNotSelectedHeaders &&
						notSelectedHeaders
							.sort((columnA, columnB) => {
								return columnA.localeCompare(columnB);
							})
							.map((column) => (
								<Checkbox
									key={column}
									onChange={(e) =>
										onChange(addSelectedHeader, removeSelectedHeader, e, column)
									}
								>
									{column}
								</Checkbox>
							))}
				</Flex>
			</Flex>
		</>
	);
}

export default ColumnsConfiguration;
