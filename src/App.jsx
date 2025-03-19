import './App.css';

import { FloatButton, Drawer, Empty } from 'antd';
import { SettingFilled, FileAddFilled } from '@ant-design/icons';
import { useState, useRef } from 'react';
import StarCoordinates from '@/components/StarCoordinates';
import useStarCoordinatesStore from '@/stores/star-coorditantes-store';
import parseCsv from '@/js/csv-parser';
import { buildPolarVector } from '@/utils/vector';
import normalizeData from '@/js/data/normalize';
import useConfigStore from '@/stores/config-store';
import Configuration from './components/Configuration';

const onFileReaderLoad = (
	event,
	parser,
	idColumn,
	setHeaders,
	setValidHeaders,
	setSelectedHeaders,
	setOriginalData,
	setNomalizedData,
	setVectors
) => {
	const result = event.target?.result;
	const csv = parser(result);
	const { columns } = csv;

	setHeaders(columns);
	setOriginalData(csv);

	// 1. Sacar las columnas que solo tienen valores numericos
	const validHeaders = [];
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
			validHeaders.push(column);
		}
	}
	setValidHeaders(validHeaders);
	setSelectedHeaders(validHeaders);

	// 2. Construir los vectores con las columnas que tienen valores numericos
	const vectors = [];
	const angleDiff = 360 / validHeaders.length;
	for (const [index, validHeader] of validHeaders.entries()) {
		const module = 1;
		const angle = index * angleDiff;
		const vector = buildPolarVector(module, angle, validHeader, validHeader);
		vectors.push(vector);
	}
	setVectors(vectors);

	// 3. Normalizar los datos
	const validData = csv.map((d) => {
		const data = {};
		for (const validHeader of validHeaders) {
			data[validHeader] = parseFloat(d[validHeader]);
		}
		return data;
	});
	const normalizedData = normalizeData(validData, validHeaders, [idColumn]);
	setNomalizedData(normalizedData);
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

	const setValidHeaders = useStarCoordinatesStore(
		(state) => state.setValidHeaders
	);
	const setSelectedHeaders = useStarCoordinatesStore(
		(state) => state.setSelectedHeaders
	);
	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const setHeaders = useStarCoordinatesStore((state) => state.setHeaders);
	const setOriginalData = useStarCoordinatesStore(
		(state) => state.setOriginalData
	);
	const setNormalizedData = useStarCoordinatesStore(
		(state) => state.setNormalizedData
	);
	const setVectors = useStarCoordinatesStore((state) => state.setVectors);

	const idColumn = useConfigStore((state) => state.idColumn);

	const fileReaderFunc = (ev) =>
		onFileReaderLoad(
			ev,
			parseCsv,
			idColumn,
			setHeaders,
			setValidHeaders,
			setSelectedHeaders,
			setOriginalData,
			setNormalizedData,
			setVectors
		);
	const fileChangeFunc = (ev) => onFileInputChange(ev, fileReaderFunc);
	return (
		<>
			{originalData.length ? (
				<StarCoordinates width={width} height={height} />
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
				<Configuration />
			</Drawer>
			<input
				ref={inputFileRef}
				type="file"
				style={{ display: 'none' }}
				onChange={(event) => fileChangeFunc(event)}
			/>
		</>
	);
}

export default App;
