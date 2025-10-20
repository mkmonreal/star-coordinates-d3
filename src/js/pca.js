import { eigs, subtract } from 'mathjs';
import { createCenteredMatrix, createCovarianceMatrix } from './operations';

const createPrincipalComponent = (eigen, index) => {
	eigen.name = `PC${index + 1}`;
	return eigen;
};

export const pca = (data) => {
	const centeredMatrix = createCenteredMatrix(data);
	const covarianceMatrix = createCovarianceMatrix(data, centeredMatrix);
	const eigen = eigs(covarianceMatrix);

	return {
		principalComponents: eigen.eigenvectors
			.sort((a, b) => subtract(b.value, a.value))
			.map(createPrincipalComponent),
		centeredMatrix,
	};
};
