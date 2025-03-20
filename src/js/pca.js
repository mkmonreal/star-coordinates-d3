import standarizeData from './data/standarize';
import { createCovarianceMatrix } from './operations';
import { eigs } from 'mathjs';

const createPrincipalComponent = (eigen, index) => {
	eigen.name = `PC${index}`;
	return eigen;
};

export const pca = (data, columns) => {
	const standarizedData = standarizeData(data, columns);
	const covarianceMatrix = createCovarianceMatrix(standarizedData, columns);
	const eigen = eigs(covarianceMatrix);

	const result = eigen.eigenvectors.sort((a, b) => b.value - a.value);

	return result;
};
