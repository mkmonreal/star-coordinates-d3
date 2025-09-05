import { useEffect, useState } from 'react';
import DimensionalityReductionStatisticalTechniquesEnum from '../enums/dimensionality-reduction-statistical-techniques-enum';
function useTransformedColumnsNames(analysis, eigenDecomposition, numArrows) {
	const [transformedColumnsNames, setTransformedColumnsNames] = useState();

	useEffect(() => {
		if (DimensionalityReductionStatisticalTechniquesEnum.NONE === analysis) {
			setTransformedColumnsNames(null);
		} else {
			if (!eigenDecomposition) {
				return;
			}
			setTransformedColumnsNames(
				eigenDecomposition.slice(0, numArrows).map((e) => e.name)
			);
		}
	}, [analysis, eigenDecomposition, numArrows]);

	return transformedColumnsNames;
}

export default useTransformedColumnsNames;
