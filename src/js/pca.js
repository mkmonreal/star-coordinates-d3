import standarizeData from './data/standarize';
import { createCenteredMatrix, createCovarianceMatrix } from './operations';
import { eigs, subtract } from 'mathjs';

const createPrincipalComponent = (eigen, index) => {
	eigen.name = `PC${index + 1}`;
	return eigen;
};

export const pca = (data) => {
	const standarizedData = standarizeData(data);
	const centeredMatrix = createCenteredMatrix(standarizedData);
	const covarianceMatrix = createCovarianceMatrix(
		standarizedData,
		centeredMatrix
	);
	const eigen = eigs(covarianceMatrix);

	return {
		principalComponents: eigen.eigenvectors
			.sort((a, b) => subtract(b.value, a.value))
			.map(createPrincipalComponent),
		centeredMatrix,
	};
};
