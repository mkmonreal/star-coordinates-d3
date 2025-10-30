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

import { useMemo } from 'react';
import DimensionalityReductionEnum from '../enums/dimensionality-reduction-enum';

function useClassesIndexMap(analysis, originalData, selectedClassColumn) {
	const classesIndexMap = useMemo(() => {
		if (DimensionalityReductionEnum.LDA !== analysis) {
			return;
		}
		if (!selectedClassColumn) {
			return;
		}

		const classesIndexMap = new Map();
		const classes = originalData.map((d) => d[selectedClassColumn]);
		for (const [index, value] of classes.entries()) {
			if (!classesIndexMap.has(value)) {
				classesIndexMap.set(value, []);
			}
			classesIndexMap.get(value).push(index);
		}

		return classesIndexMap;
	}, [analysis, originalData, selectedClassColumn]);

	return classesIndexMap;
}

export default useClassesIndexMap;
