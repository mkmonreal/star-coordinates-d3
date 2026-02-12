//    Copyright 2026 Miguel Ángel Monreal Velasco

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import { extent, select } from 'd3';
import { max, min } from 'mathjs';
import { useEffect } from 'react';

function useAutomaticMovement(
	svgRef,
	currentViewBox,
	unitCircleRadius,
	vectors,
	points
) {
	useEffect(() => {
		if (!points?.length) {
			return;
		}

		const aspectRatio =
			currentViewBox.current.width / currentViewBox.current.height;

		const minX = -unitCircleRadius - 50;
		const minY = -unitCircleRadius - 50;
		const minWidth = -2 * minX;
		const minHeight = -2 * minY;

		const xVectors = extent(
			vectors.map((vector) => vector.cartesian.x * unitCircleRadius)
		);
		const yVectors = extent(
			vectors.map((vector) => -vector.cartesian.y * unitCircleRadius)
		);

		const xs = extent(points.map((point) => point.x)).map(
			(point) => point * unitCircleRadius
		);
		const ys = extent(points.map((point) => point.y)).map(
			(point) => point * unitCircleRadius
		);

		const newMinX = min(minX, xVectors[0] - 50, xs[0] - 25);
		const newMinY = min(minY, yVectors[0] - 50, -ys[1] - 25);
		let newMaxX = max(minX + minWidth, xVectors[1] + 50, xs[1] + 25);
		let newMaxY = max(minY + minHeight, yVectors[1] + 50, -ys[0] + 25);
		newMaxX = max(newMaxX, aspectRatio * newMaxY);
		newMaxY = max(newMaxY, aspectRatio / newMaxY);
		const newWidth = newMaxX - newMinX;
		const newHeight = newMaxY - newMinY;

		currentViewBox.current = {
			x: newMinX,
			y: newMinY,
			width: newWidth,
			height: newHeight,
		};

		const svg = select(svgRef.current);
		svg
			.transition(500)
			.attr(
				'viewBox',
				`${currentViewBox.current.x} ${currentViewBox.current.y} ${currentViewBox.current.width} ${currentViewBox.current.height}`
			);
	}, [svgRef, currentViewBox, unitCircleRadius, vectors, points]);
}

export default useAutomaticMovement;
