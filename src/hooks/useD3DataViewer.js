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
