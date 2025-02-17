import { select } from 'd3';
import { randomInt } from 'mathjs';
import { standarizeData } from './js/standarize';
import { normalizeData } from './js/normalize';
import { buildPolarVector, buildCartesianVector, addLable } from './js/vector';
import { drawArrows } from './js/arrow';
import { drawDots } from './js/dot';
import { setUpFileInput } from './js/file-reader';
import { parseCsv } from './js/csv-parser';

const width = window.innerWidth;
const height = window.innerHeight;
const center = [width / 2, height / 2];
const radius = Math.min(width, height) / 4;

const headers = [
  'hp',
  'attack',
  'defense',
  'sp_attack',
  'sp_defense',
  'speed',
];

let newColumns = [];

const vectors = [];
const data = [];

for (let i = 0; i < 1028; i += 1) {
  const obj = {};
  for (let j = 0; j < headers.length; j += 1) {
    obj[headers[j]] = randomInt(255);
  }
  data.push(obj);
}

for (let i = 0; i < headers.length; i += 1) {
  const header = headers[i];

  vectors.push(
    addLable(buildPolarVector(radius, (360 / headers.length) * i), header),
  );
}

const selectSvg = (width, height, backgroundColor, selection) => select(selection ?? 'svg')
  .attr('width', width)
  .attr('height', height)
  .attr('background-color', backgroundColor ?? 'gray');

const drawCircle = (selection, r, cx, cy, stroke, fill) => selection
  .append('circle')
  .attr('r', r)
  .attr('cx', cx)
  .attr('cy', cy)
  .attr('stroke', stroke ?? 'black')
  .attr('fill', fill ?? 'none');

const draw = (vectors, data, columns) => {
  const svg = selectSvg(width, height);

  drawCircle(svg, radius, center[0], center[1]);
  drawArrows(svg, vectors, center[0], center[1], (event, d) => {
    const newVectors = vectors.map((vector) => {
      if (vector.lable === d.lable) {
        d = addLable(
          buildCartesianVector(event.x - center[0], event.y - center[1]),
          d.lable,
        );
        vector = d;
      }
      return vector;
    });

    draw(newVectors, data, columns);
  });
  drawDots(svg, vectors, center[0], center[1], data);

  return svg;
};

const normalizedData = normalizeData(data, columns);
const standarizedData = standarizeData(data, columns);

draw(vectors, normalizedData, columns);

setUpFileInput((ev) => {
  const { result } = ev.target;
  const resultCsv = parseCsv(result);
  newColumns = resultCsv.columns;
  const newNomalizedData = normalizeData(resultCsv, columns);
  const newStandarizedData = standarizeData(resultCsv, newColumns);

  const pcaResult = pca(resultCsv, columns);
  console.log(pcaResult);
  let newVectors = [];

  columns.forEach((column, index) => {
    newVectors.push(addLable(buildCartesianVector(pcaResult[0].eigenvector[index], pcaResult[1].eigenvector[index]), column));
  });
  console.log(newVectors);

  newVectors = newVectors.map((vector) => addLable(buildPolarVector(vector.polar.module * radius, vector.polar.angle), vector.lable));
  console.log(newVectors);
  console.log(newVectors.sort((a, b) => b.polar.module - a.polar.module));
  draw(newVectors, newStandarizedData, columns);

  // draw(vectors, newStandarizedData, columns);
});

console.log('Covariance matrix');
const cMatrix = createCovarianceMatrix(standarizedData, columns);
console.log(cMatrix);
console.log('Eign');
const eigen = eigs(cMatrix);
console.log(eigen);
