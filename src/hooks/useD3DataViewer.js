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
import { useEffect, useRef, useState } from 'react';

function useD3DataViewer(svgRef, points) {
	const [popoverVisible, setPopoverVisible] = useState(false);
	const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
	const [popoverData, setPopoverData] = useState(null);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [drawerData, setDrawerData] = useState(null);
	const popoverRef = useRef(null);
	const hideTimeoutRef = useRef(null);

	useEffect(() => {
		if (!svgRef.current || !points || points.length === 0) {
			return;
		}

		const svg = select(svgRef.current);

		svg.selectAll('.data-circle').on('mouseover', function (event, d) {
			select(this).style('cursor', 'pointer');

			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
				hideTimeoutRef.current = null;
			}

			const x = event.clientX;
			const y = event.clientY;

			setPopoverPosition({ x, y });
			setPopoverData(d.originalValue);
			setPopoverVisible(true);
		});

		svg.selectAll('.data-circle').on('mouseout', function () {
			select(this).style('cursor', null);

			hideTimeoutRef.current = setTimeout(() => {
				setPopoverVisible(false);
				setPopoverData(null);
			}, 100);
		});

		svg.selectAll('.data-circle').on('click', function (event, d) {
			event.stopPropagation();
			setDrawerData(d.originalValue);
			setDrawerVisible(true);
		});

		return () => {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, [svgRef, points]);

	return {
		popoverVisible,
		popoverPosition,
		popoverData,
		popoverRef,
		drawerVisible,
		drawerData,
		setDrawerVisible,
	};
}

export default useD3DataViewer;
