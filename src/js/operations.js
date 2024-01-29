export const sumarize = (data) => data.reduce((x, y) => x + y);

export const mean = (data) => sumarize(data) / data.length;

export const variance = (data, mean) => {
    mean = mean ?? mean(data);
    const sum = data.reduce((x, y) => x + Math.pow(y - mean, 2));
    return sum / data.length;
};

export const standardDeviation = (data, mean) => Math.sqrt(variance(data, mean));

export const covariance = (dataA, dataB, meanA, meanB) => {
    if (dataA.length != dataB.length) {
        console.error();
        return undefined;
    }

    let sum = 0;
    meanA = meanA ?? mean(dataA);
    meanB = meanB ?? mean(dataB);

    for (let i = 0; i < dataA.length; i++) {
        sum = (dataA[i] - meanA) * (dataB[i] - meanB);
    }

    return sum / dataA.length;
};

export const covarianceMatrix = (data, headers, means) => {
    const result = [];
    for (let i = 0; i < headers.length; i++) {
        result[i] = [];
    }

    if (!means) {
        means = {};
        for (let header of headers) {
            means[header] = mean(data.map(x => x[header]));
        }
    }

    for (let i = 0; i < headers.length; i++) {
        for (let j = 0; j < headers.length; j++) {
            if (result[i][j]) {
                continue;
            }

            if (i === j) {
                const d = data.map(x => x[headers[i]]);
                result[i][j] = variance(d, means[headers[i]]);
            } else {
                const dA = data.map(x => x[headers[i]]);
                const dB = data.map(x => x[headers[j]]);
                const r = covariance(dA, dB, means[headers[i]], means[headers[j]]);
                result[i][j] = r;
                result[j][i] = r;
            }
        }
    }

    return result;
};
