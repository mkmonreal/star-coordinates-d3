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
