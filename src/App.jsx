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

import './App.css';

import {
	FileAddFilled,
	GithubOutlined,
	SettingFilled,
	SelectOutlined,
} from '@ant-design/icons';
import { Drawer, Empty, Flex, FloatButton } from 'antd';
import { useRef, useState } from 'react';
import Configuration from './components/Configuration';
import StarCoordinatesWrapper from './components/StarCoordinatesWrapper';
import parseCsv from './js/csv-parser';
import useConfigStore from './stores/config-store';
import useStarCoordinatesStore from './stores/star-coorditantes-store';

const onFileReaderLoad = (
	parser,
	setOriginalData,
	setColumns,
	setValidColumns,
	setSelectedColumns,
	idColumn,
	event
) => {
	const result = event.target?.result;
	let csv = parser(result);

	csv.columns = ['scIdColumn', ...csv.columns];
	const { columns } = csv;
	csv = csv.map((row, i) => ({ ...row, scIdColumn: i }));
	csv.columns = columns;
	setColumns(columns);
	setOriginalData(csv);

	const validColumns = [];
	const incompleteColumn = [];
	for (const column of columns) {
		const columnWithoutNull = csv
			.map((d) => d[column])
			.filter((d) => d !== null && d !== undefined);
		if (columnWithoutNull < csv.length) {
			incompleteColumn.push(column);
		}
		const numericData = columnWithoutNull
			.map((d) => parseFloat(d))
			.filter((d) => !isNaN(d));
		if (numericData.length === columnWithoutNull.length) {
			if (idColumn !== column) {
				validColumns.push(column);
			}
		}
	}
	setValidColumns(validColumns);
	setSelectedColumns(validColumns);
};

const onFileInputChange = (event, onLoad) => {
	const fileReader = new FileReader();
	fileReader.onload = onLoad;
	fileReader.readAsText(event.target?.files[0], 'UTF-8');
};

function App() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	const [isOpen, setIsOpen] = useState(false);
	const inputFileRef = useRef();

	const idColumn = useConfigStore((state) => state.idColumn);
	const selectionMode = useConfigStore((state) => state.selectionMode);
	const setSelectionMode = useConfigStore((state) => state.setSelectionMode);
	const clearSelectedPoints = useConfigStore(
		(state) => state.clearSelectedPoints
	);

	const validColumns = useStarCoordinatesStore((state) => state.validColumns);
	const setOriginalData = useStarCoordinatesStore(
		(state) => state.setOriginalData
	);
	const setColumns = useStarCoordinatesStore((state) => state.setColumns);
	const setValidColumns = useStarCoordinatesStore(
		(state) => state.setValidColumns
	);
	const setSelectedColumns = useStarCoordinatesStore(
		(state) => state.setSelectedColumns
	);

	const fileReaderFunc = (ev) =>
		onFileReaderLoad(
			parseCsv,
			setOriginalData,
			setColumns,
			setValidColumns,
			setSelectedColumns,
			idColumn,
			ev
		);

	const fileChangeFunc = (ev) => onFileInputChange(ev, fileReaderFunc);

	return (
		<Flex
			align="center"
			justify="center"
			style={{ height: '100vh', width: '100%' }}
		>
			{validColumns.length ? (
				<StarCoordinatesWrapper width={width} height={height} />
			) : (
				<Empty />
			)}

			<FloatButton.Group shape="circle">
				{validColumns.length > 0 && (
					<>
						<FloatButton
							icon={<SelectOutlined />}
							type={selectionMode ? 'primary' : 'default'}
							onClick={() => {
								if (selectionMode) {
									clearSelectedPoints();
								}
								setSelectionMode(!selectionMode);
							}}
							tooltip="Selection mode"
						/>
						<FloatButton
							icon={<SettingFilled />}
							type="default"
							onClick={() => setIsOpen(true)}
						/>
					</>
				)}
				<FloatButton
					icon={<FileAddFilled />}
					type="primary"
					onClick={() => {
						inputFileRef.current?.click();
					}}
				/>
				<FloatButton
					icon={<GithubOutlined />}
					href="https://github.com/mkmonreal/star-coordinates-d3"
					target="_blank"
				/>
			</FloatButton.Group>
			<Drawer
				title="Configuration"
				onClose={() => setIsOpen(false)}
				open={isOpen}
			>
				<Configuration />
			</Drawer>
			<input
				ref={inputFileRef}
				type="file"
				style={{ display: 'none' }}
				onChange={(event) => fileChangeFunc(event)}
			/>
		</Flex>
	);
}

export default App;
