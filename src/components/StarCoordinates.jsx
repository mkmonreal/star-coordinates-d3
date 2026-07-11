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

import { Popover, Descriptions, Drawer } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useAutomaticMovement from '../hooks/useAutomaticMovement';
import useD3ArrowDrag from '../hooks/useD3ArrowDrag';
import useD3ArrowRender from '../hooks/useD3ArrowRender';
import useD3DataCircleRender from '../hooks/useD3DataCircleRender';
import useD3DataViewer from '../hooks/useD3DataViewer';
import useD3SVGSetup from '../hooks/useD3SVGSetup';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import { calculatePoints } from '../utils/data-projection';

function StarCoordinates({
	width,
	height,
	vectors,
	onVectorUpdate,
	dataMatrix,
}) {
	const { svgRef, currentViewBox } = useD3SVGSetup(width, height);

	const originalData = useStarCoordinatesStore((state) => state.originalData);
	const selectedColumns = useStarCoordinatesStore(
		(state) => state.selectedColumns
	);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);

	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const idColumn = useConfigStore((state) => state.idColumn);

	const points = useMemo(() => {
		return calculatePoints(vectors, dataMatrix, originalData);
	}, [vectors, dataMatrix, originalData]);

	useD3ArrowRender(svgRef, vectors);
	useD3DataCircleRender(svgRef, points);
	useD3ArrowDrag(onVectorUpdate, svgRef, points, vectors, dataMatrix);

	useAutomaticMovement(
		svgRef,
		currentViewBox,
		unitCircleRadius,
		vectors,
		points
	);

	const {
		popoverVisible,
		popoverPosition,
		popoverData,
		popoverRef,
		drawerVisible,
		drawerData,
		setDrawerVisible,
	} = useD3DataViewer(svgRef, points);

	const formatValue = (value) => {
		if (typeof value === 'number') {
			return value.toFixed(3);
		}
		return value;
	};

	const isHighlighted = (key) => {
		return selectedColumns.includes(key) || key === selectedClassColumn;
	};

	const popoverContent = popoverData ? (
		<Descriptions
			title="Datos del punto"
			column={1}
			size="small"
			bordered
			style={{ maxWidth: 400 }}
		>
			{Object.entries(popoverData)
				.filter(([key]) => key !== idColumn && key !== 'scIdColumn')
				.map(([key, value]) => (
					<Descriptions.Item
						key={key}
						label={key}
						labelStyle={
							isHighlighted(key)
								? { fontWeight: 'bold', color: '#1890ff' }
								: {}
						}
					>
						{formatValue(value)}
					</Descriptions.Item>
				))}
		</Descriptions>
	) : null;

	const drawerContent = drawerData ? (
		<Descriptions
			title="Datos del punto"
			column={1}
			size="small"
			bordered
		>
			{Object.entries(drawerData)
				.filter(([key]) => key !== idColumn && key !== 'scIdColumn')
				.map(([key, value]) => (
					<Descriptions.Item
						key={key}
						label={key}
						labelStyle={
							isHighlighted(key)
								? { fontWeight: 'bold', color: '#1890ff' }
								: {}
						}
					>
						{formatValue(value)}
					</Descriptions.Item>
				))}
		</Descriptions>
	) : null;

	return (
		<>
			<svg className="star-coordinates" ref={svgRef}></svg>
			<Popover
				open={popoverVisible}
				content={popoverContent}
				placement="topRight"
			>
				<div
					ref={popoverRef}
					style={{
						position: 'absolute',
						left: popoverPosition.x,
						top: popoverPosition.y,
						width: 1,
						height: 1,
						pointerEvents: 'none',
					}}
				/>
			</Popover>
			<Drawer
				title="Información del punto"
				placement="left"
				onClose={() => setDrawerVisible(false)}
				open={drawerVisible}
			>
				{drawerContent}
			</Drawer>
		</>
	);
}

StarCoordinates.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	vectors: PropTypes.array.isRequired,
	onVectorUpdate: PropTypes.func.isRequired,
	dataMatrix: PropTypes.object.isRequired,
};

export default StarCoordinates;
