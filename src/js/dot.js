const getDotsSelection = (selecttion, positions) =>
  selecttion.selectAll(".dot").data(positions);

const updatePosition = (selection) =>
  selection.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

const enter = (selection) =>
  updatePosition(
    selection
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("stroke", "salmon")
      .attr("fill", "salmon")
  );

const merge = (selection, enter) => updatePosition(selection.merge(enter));

const exit = (selection) => selection.exit().remove();

const calculatePositions = (cx, cy, vectors, data) => {
  const positions = data.map((d) => {
    let x = cx;
    let y = cy;
    for (let vector of vectors) {
      x += d[vector.lable] * vector.cartesian.x;
      y += d[vector.lable] * vector.cartesian.y;
    }
    d.x = x;
    d.y = y;
    return d;
  });
  return positions;
};

const drawDots = (selection, vectors, cx, cy, data) => {
  const positions = calculatePositions(cx, cy, vectors, data);
  const sel = getDotsSelection(selection, positions);
  const e = enter(sel);
  merge(sel, e);
  exit(sel);
};

export { drawDots };
