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

import {
	interpolateBlues,
	interpolateGreens,
	interpolateGreys,
	interpolateOranges,
	interpolatePurples,
	interpolateViridis,
} from 'd3';

const ColorsetEnum = Object.freeze({
	BLUES: { name: 'Blues', interpolate: interpolateBlues },
	GREENS: { name: 'Greens', interpolate: interpolateGreens },
	GREYS: { name: 'Greys', interpolate: interpolateGreys },
	ORANGES: { name: 'Oranges', interpolate: interpolateOranges },
	PURPLES: { name: 'Purples', interpolate: interpolatePurples },
	VIRIDIS: { name: 'Viridis', interpolate: interpolateViridis },
});

export default ColorsetEnum;
