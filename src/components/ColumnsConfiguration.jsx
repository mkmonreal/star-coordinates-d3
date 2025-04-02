import { Button, Checkbox, Flex, Select } from 'antd';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import useConfigStore from '../stores/config-store';
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

	const validColumns = useStarCoordinatesStore((state) => state.validColumns);
	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const addSelectedHeader = useStarCoordinatesStore(
		(state) => state.addSelectedColumn
	);
	const removeSelectedColumn = useStarCoordinatesStore(
		(state) => state.removeSelectedColumn
	);

	const [showNotSelectedColumns, setShowNotSelectedColumns] = useState(false);

	const notSelectedHeaders = validColumns.filter(
		(column) => !selectedColumns.includes(column)
	);

	return (
		<Flex gap="large" vertical>
			<Flex gap="small" style={{ width: '100%' }}>
				<h3>Id column:</h3>
				{validColumns && (
					<Select
						onChange={(value) => setIdColumn(value)}
						value={idColumn}
						style={{ flex: 1 }}
					>
						{validColumns.map((header) => (
							<Select.Option key={header} value={header}>
								{header}
							</Select.Option>
						))}
					</Select>
				)}
			</Flex>
			<Flex gap="small" vertical>
				{selectedColumns
					.sort((columnA, columnB) => {
						return columnA.localeCompare(columnB);
					})
					.map((column) => (
						<Checkbox
							key={column}
							onChange={(e) =>
								onChange(addSelectedHeader, removeSelectedColumn, e, column)
							}
							checked={true}
						>
							{column}
						</Checkbox>
					))}
				{notSelectedHeaders && notSelectedHeaders.length > 0 && (
					<Button
						type="link"
						onClick={() => setShowNotSelectedColumns(!showNotSelectedColumns)}
					>
						{showNotSelectedColumns ? '-' : '+'} Not selected columns
					</Button>
				)}

				{showNotSelectedColumns &&
					notSelectedHeaders
						.sort((columnA, columnB) => {
							return columnA.localeCompare(columnB);
						})
						.map((column) => (
							<Checkbox
								key={column}
								onChange={(e) =>
									onChange(addSelectedHeader, removeSelectedColumn, e, column)
								}
							>
								{column}
							</Checkbox>
						))}
			</Flex>
		</Flex>
	);
}

export default ColumnsConfiguration;
