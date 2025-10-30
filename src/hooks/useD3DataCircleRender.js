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

import { select } from 'd3';
import { useEffect } from 'react';
import useConfigStore from '../stores/config-store';
import useStarCoordinatesStore from '../stores/star-coorditantes-store';
import {
	enterDataCircle,
	exitDataCircle,
	updateDataCircle,
} from '../utils/d3-data-circle';
import useD3ColorScale from './useD3ColorScale';

function useD3DataCircleRender(svgRef, points) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const selectedClassColumn = useStarCoordinatesStore(
		(state) => state.selectedClassColumn
	);
	const { selectColor } = useD3ColorScale(selectedClassColumn);

	useEffect(() => {
		if (!points) {
			return;
		}

		const svg = select(svgRef.current);

		svg
			.select('.data-circles')
			.selectAll('.data-circle')
			.data(points, (point) => `${point.id}`)
			.join(
				(enter) =>
					enterDataCircle(
						enter,
						unitCircleRadius,
						selectColor,
						selectedClassColumn
					),
				(update) =>
					updateDataCircle(
						update,
						unitCircleRadius,
						selectColor,
						selectedClassColumn
					),
				exitDataCircle
			);
	}, [svgRef, points, unitCircleRadius, selectColor, selectedClassColumn]);
}

export default useD3DataCircleRender;
