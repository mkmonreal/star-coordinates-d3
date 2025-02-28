import './App.css';

import { FloatButton, Drawer, Empty } from 'antd';
import { SettingFilled, FileAddFilled } from '@ant-design/icons';
import { useState, useRef } from 'react';
import StarCoordinates from './components/StarCoordinates';
import useStarCoordinatesStore from './stores/star-coorditantes-store';
import parseCsv from './js/csv-parser';

const onFileReaderLoad = (event, parser, setHeaders, setOriginalData) => {
	const result = event.target?.result;
	const csv = parser(result);
	const { columns } = csv;

	setHeaders(columns);
	setOriginalData(csv);
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

	const headers = useStarCoordinatesStore((state) => state.headers);
	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const setHeaders = useStarCoordinatesStore((state) => state.setHeaders);
	const setOriginalData = useStarCoordinatesStore((state) => state.setOriginalData);

	const fileReaderFunc = (ev) => onFileReaderLoad(ev, parseCsv, setHeaders, setOriginalData);
	const fileChangeFunc = (ev) => onFileInputChange(ev, fileReaderFunc);
	return (
		<>
			{
				originalData.length
					? <StarCoordinates width={width} height={height} />
					: <Empty />
			}

			<FloatButton.Group shape="circle">
				<FloatButton
					icon={<FileAddFilled />}
					type="primary"
					onClick={() => {
						inputFileRef.current?.click();
					}}
				/>
				<FloatButton icon={<SettingFilled />} type="default" onClick={() => setIsOpen(true)} />
			</FloatButton.Group>
			<Drawer title="Configuration" onClose={() => setIsOpen(false)} open={isOpen} />
			<input ref={inputFileRef} type="file" style={{ display: 'none' }} onChange={(event) => fileChangeFunc(event)} />
		</>
	);
}

export default App;
