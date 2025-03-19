import { Checkbox } from 'antd';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';

const onChange = (onCheck, onUncheck, e, column) => {
	if (e.target.checked) {
		onCheck(column);
	} else {
		onUncheck(column);
	}
};

function ColumnsConfiguration() {
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

	return (
		<>
			{validHeaders &&
				validHeaders
					.sort((column) => (selectedHeaders.includes(column) ? 1 : 0))
					.map((column) => (
						<Checkbox
							key={column}
							onChange={(e) =>
								onChange(addSelectedHeader, removeSelectedHeader, e, column)
							}
							checked={selectedHeaders.includes(column)}
						>
							{column}
						</Checkbox>
					))}
		</>
	);
}

export default ColumnsConfiguration;
