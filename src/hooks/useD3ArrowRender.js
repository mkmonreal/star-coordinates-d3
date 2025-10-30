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
import { enterArrows, exitArrows, updateArrows } from '../utils/d3-arrow';

function useD3ArrowRender(svgRef, vectors) {
	const unitCircleRadius = useConfigStore((state) => state.unitCircleRadius);
	const arrowHeadScale = unitCircleRadius / 250;

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}
		if (!vectors) {
			return;
		}

		select(svgRef.current)
			.select('.arrows')
			.selectAll('.arrow')
			.data(vectors, (vector) => vector.label)
			.join(
				(enter) => enterArrows(enter, unitCircleRadius, arrowHeadScale),
				(update) => updateArrows(update, unitCircleRadius, arrowHeadScale),
				exitArrows
			);
	}, [svgRef, vectors, unitCircleRadius, arrowHeadScale]);
}

export default useD3ArrowRender;
