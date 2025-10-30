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

import { Button, Checkbox, Flex, Select } from 'antd';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import useConfigStore from '../stores/config-store';
import { useState } from 'react';

const onChange = (onCheck, onUncheck, checked, column) => {
	if (checked) {
		onCheck(column);
	} else {
		onUncheck(column);
	}
};

function ColumnsConfiguration({ idColumn }) {
	const setIdColumn = useConfigStore((state) => state.setIdColumn);
	const setVectorsInitialized = useConfigStore(
		(state) => state.setVectorsInitialized
	);

	const validColumns = useStarCoordinatesStore((state) => state.validColumns);
	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const addSelectedColumn = useStarCoordinatesStore(
		(state) => state.addSelectedColumn
	);
	const removeSelectedColumn = useStarCoordinatesStore(
		(state) => state.removeSelectedColumn
	);

	const [showNotSelectedColumns, setShowNotSelectedColumns] = useState(false);

	const notSelectedColumns = validColumns.filter(
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
							onChange={(e) => {
								onChange(
									addSelectedColumn,
									removeSelectedColumn,
									e.target.checked,
									column
								);
								setVectorsInitialized(false);
							}}
							checked={true}
						>
							{column}
						</Checkbox>
					))}
				{notSelectedColumns && notSelectedColumns.length > 0 && (
					<Button
						type="link"
						onClick={() => setShowNotSelectedColumns(!showNotSelectedColumns)}
					>
						{showNotSelectedColumns ? '-' : '+'} Not selected columns
					</Button>
				)}

				{showNotSelectedColumns &&
					notSelectedColumns
						.sort((columnA, columnB) => {
							return columnA.localeCompare(columnB);
						})
						.map((column) => (
							<Checkbox
								key={column}
								onChange={(e) => {
									onChange(
										addSelectedColumn,
										removeSelectedColumn,
										e.target.checked,
										column
									);
									setVectorsInitialized(false);
								}}
							>
								{column}
							</Checkbox>
						))}
			</Flex>
		</Flex>
	);
}

export default ColumnsConfiguration;
