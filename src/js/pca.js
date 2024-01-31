import { standarizeData } from "./standarize";
import { createCovarianceMatrix } from "./operations";
import { eigs } from "mathjs";

const createPrincipalComponent = (eigen, index) => {
    eigen.name = `PC${index}`;
    return eigen;
};

export const pca = (data, columns) => {
    let result = [];
    const standarizedData = standarizeData(data, columns);
    const covarianceMatrix = createCovarianceMatrix(standarizedData, columns);
    const eigen = eigs(covarianceMatrix);

    for (let i = 0; i < columns.length; i++) {
        result.push({ eigenvalue: eigen.values[i], eigenvector: eigen.vectors[i] });
    }

    return result.sort((a, b) => b.eigenvalue - a.eigenvalue)
        .map((elem, index) => createPrincipalComponent(elem, index));
};
