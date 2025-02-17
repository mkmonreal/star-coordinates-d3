import { line, drag } from 'd3';
import { buildCartesianVector } from '../utils/vector';

const getLineGenerator = () => line();

const getArrowHead = (lineGenerator, cx, cy, x, y) => {
  x += cx;
  y += cy;
  const path = [];
  path.push([x - 15, y]);
  path.push([x - 18, y + 6]);
  path.push([x, y]);
  path.push([x - 18, y - 6]);
  path.push([x - 15, y]);
  return lineGenerator(path);
};

const getArrowBody = (lineGenerator, cx, cy, x, y) => {
  const path = [];
  path.push([cx, cy]);
  path.push([cx + x, cy + y]);
  return lineGenerator(path);
};

const getArrowsSelection = (selection, vectors) => selection.selectAll('.arrow').data(vectors, (d) => `${d.lable}${d.cartesian.x}${d.cartesian.y}`);

const addArrowBody = (selection, lineGenerator, cx, cy) => selection
  .append('path')
  .attr('class', 'arrow-body')
  .attr('d', (d) => getArrowBody(lineGenerator, cx, cy, d.cartesian.x, d.cartesian.y))
  .attr('stroke', 'black');

const addArrowHead = (selection, lineGenerator, cx, cy, dragFunction) => selection
  .append('path')
  .attr('class', 'arrow-head')
  .attr('d', (d) => getArrowHead(lineGenerator, cx, cy, d.cartesian.x, d.cartesian.y))
  .attr(
    'transform',
    (d) => `rotate(${d.polar.angle}, ${d.cartesian.x + cx}, ${d.cartesian.y + cy})`,
  )
  .attr('stroke', 'black')
  .attr('fill', 'lightgray')

  .call(drag()

    .on('drag', dragFunction));

const addArrow = (selection, lineGenerator, cx, cy, dragFunction) => {
  addArrowBody(selection, lineGenerator, cx, cy);
  addArrowHead(selection, lineGenerator, cx, cy, dragFunction);
  return selection;
};

const updateArrowHead = (selection, lineGenerator, cx, cy, dragFunction) => selection
  .selectAll('.arrow-head')
  .attr('d', (d) => getArrowHead(lineGenerator, cx, cy, d.cartesian.x, d.cartesian.y))
  .attr(
    'transform',
    (d) => `rotate(${d.polar.angle}, ${d.cartesian.x + cx}, ${d.cartesian.y + cy})`,
  )
  .call(drag().on('drag', dragFunction));

const updateArrowBody = (selection, lineGenerator, cx, cy) => selection
  .selectAll('.arrow-body')
  .attr('d', (d) => getArrowBody(lineGenerator, cx, cy, d.cartesian.x, d.cartesian.y));

const updateArrow = (selection, lineGenerator, cx, cy, dragFunction) => {
  updateArrowBody(selection, lineGenerator, cx, cy);
  updateArrowHead(selection, lineGenerator, cx, cy, dragFunction);
  return selection;
};

const enter = (selection) => selection.enter().append('g').attr('class', 'arrow');

const merge = (selection, enter) => selection.merge(enter);

const exit = (selection) => selection.exit().remove();

const drawArrows = (selection, vectors, cx, cy, dragFunction) => {
  const lineGenerator = getLineGenerator();
  const sel = getArrowsSelection(selection, vectors);
  const e = enter(sel);
  addArrow(e, lineGenerator, cx, cy, dragFunction);
  const m = merge(sel, e);
  updateArrow(m, lineGenerator, cx, cy, dragFunction);
  exit(sel);
};

const dragArrow = (redrawFucntion) => (event, d) => {
  d = buildCartesianVector(event.x - cx, event.y - cy);
};

export { drawArrows, dragArrow };
