import standarizeData from './data/standarize';
import { createCovarianceMatrix } from './operations';
import { eigs, subtract } from 'mathjs';

const createPrincipalComponent = (eigen, index) => {
	eigen.name = `PC${index}`;
	return eigen;
};

export const pca = (data) => {
	const standarizedData = standarizeData(data);
	const covarianceMatrix = createCovarianceMatrix(standarizedData);
	const eigen = eigs(covarianceMatrix);

	return eigen.eigenvectors
		.sort((a, b) => subtract(b.value, a.value))
		.map(createPrincipalComponent);
};
