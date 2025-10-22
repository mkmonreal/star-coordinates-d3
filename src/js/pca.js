import { eigs, subtract } from 'mathjs';
import { createCenteredMatrix, createCovarianceMatrix } from './operations';

export function pca(data) {
	const centeredMatrix = createCenteredMatrix(data);
	const covarianceMatrix = createCovarianceMatrix(data, centeredMatrix);
	const eigen = eigs(covarianceMatrix);

	return {
		principalComponents: eigen.eigenvectors
			.toSorted((a, b) => subtract(b.value, a.value))
			.map(createPrincipalComponent),
		centeredMatrix,
	};
}

const createPrincipalComponent = (eigen, index) => {
	eigen.name = `PC${index + 1}`;
	return eigen;
};
