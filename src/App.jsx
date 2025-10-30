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

import './App.css';

import { FileAddFilled, SettingFilled } from '@ant-design/icons';
import { Drawer, Empty, Flex, FloatButton } from 'antd';
import { useRef, useState } from 'react';
import Configuration from './components/Configuration';
import StarCoordinatesWrapper from './components/StarCoordinatesWrapper';
import parseCsv from './js/csv-parser';
import useConfigStore from './stores/config-store';
import useStarCoordinatesStore from './stores/star-coorditantes-store';

const onFileReaderLoad = (
	event,
	parser,
	setOriginalData,
	setColumns,
	setValidColumns,
	setSelectedColumns
) => {
	const result = event.target?.result;
	const csv = parser(result);
	const { columns } = csv;

	setColumns(columns);
	setOriginalData(csv);

	// 1. Sacar las columnas que solo tienen valores numericos
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
			validColumns.push(column);
		}
	}
	setValidColumns(validColumns);
	setSelectedColumns(validColumns);

	// 2. Crear los vectores. NO ES NECESARIO

	// 3. Normalizar los datos. NO ES NECESARIO
	// 3.1. Crear la matriz de datos
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
			ev,
			parseCsv,
			setOriginalData,
			setColumns,
			setValidColumns,
			setSelectedColumns
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
				<FloatButton
					icon={<FileAddFilled />}
					type="primary"
					onClick={() => {
						inputFileRef.current?.click();
					}}
				/>
				<FloatButton
					icon={<SettingFilled />}
					type="default"
					onClick={() => setIsOpen(true)}
				/>
			</FloatButton.Group>
			<Drawer
				title="Configuration"
				onClose={() => setIsOpen(false)}
				open={isOpen}
			>
				<Configuration idColumn={idColumn} />
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
