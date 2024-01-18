import { select } from "d3";
import { randomInt } from "mathjs";
import { standarizeData } from "./js/standarize";
import { normalizeData } from "./js/normalize";
import { buildPolarVector, buildCartesianVector, addLable } from "./js/vector";
import { drawArrows } from "./js/arrow";
import { drawDots } from "./js/dot";
import { setUpFileInput } from "./js/file-reader";
import { parseCsv } from "./js/csv-parser";

const width = window.innerWidth;
const height = window.innerHeight;
const center = [width / 2, height / 2];
const radius = Math.min(width, height) / 4;

const headers = [
  "hp",
  "attack",
  "defense",
  "sp_attack",
  "sp_defense",
  "speed",
];

let newHeaders = [];

const vectors = [];
const data = [];

for (let i = 0; i < 1028; i++) {
  let obj = {};
  for (let j = 0; j < headers.length; j++) {
    obj[headers[j]] = randomInt(255);
  }
  data.push(obj);
}

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];

  vectors.push(
    addLable(buildPolarVector(radius, (360 / headers.length) * i), header)
  );
}

const selectSvg = (width, height, backgroundColor, selection) =>
  select(selection ?? "svg")
    .attr("width", width)
    .attr("height", height)
    .attr("background-color", backgroundColor ?? "gray");

const drawCircle = (selection, r, cx, cy, stroke, fill) =>
  selection
    .append("circle")
    .attr("r", r)
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("stroke", stroke ?? "black")
    .attr("fill", fill ?? "none");

const draw = (vectors, data, headers) => {
  const svg = selectSvg(width, height);

  drawCircle(svg, radius, center[0], center[1]);
  drawArrows(svg, vectors, center[0], center[1], (event, d) => {
    const newVectors = vectors.map((vector) => {
      if (vector.lable === d.lable) {
        d = addLable(
          buildCartesianVector(event.x - center[0], event.y - center[1]),
          d.lable
        );
        vector = d;
      }
      return vector;
    });

    draw(newVectors, data, headers);
  });
  drawDots(svg, vectors, center[0], center[1], data);

  return svg;
};

const normalizedData = normalizeData(data, headers);
const standarizedData = standarizeData(data, headers);

draw(vectors, normalizedData, headers);

setUpFileInput((ev) => {
  const result = ev.target.result;
  const resultCsv = parseCsv(result);
  newHeaders = resultCsv.columns;
  const newNomalizedData = normalizeData(resultCsv, headers);
  const newStandarizedData = standarizeData(resultCsv, newHeaders);

  console.log(newStandarizedData);
  console.log(newNomalizedData);

  draw(vectors, newStandarizedData, headers);
});
