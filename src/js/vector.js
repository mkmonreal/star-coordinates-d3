import { unit, cos, sin, atan2, sqrt } from "mathjs";

const toDeg = (rad) => rad * (180 / Math.PI);

const addCartesian = (vector) => {
  const angleUnit = unit(vector.polar.angle, "deg");
  const x = vector.polar.module * cos(angleUnit);
  const y = vector.polar.module * sin(angleUnit);
  vector.cartesian = { x, y };
  return vector;
};

const addPolar = (vector) => {
  const module = sqrt(vector.cartesian.x ** 2 + vector.cartesian.y ** 2);
  //in svg de y-axis is inverted
  const angle = toDeg(atan2(vector.cartesian.x, -vector.cartesian.y)) - 90;
  vector.polar = { module, angle };
  return vector;
};

const buildPolarVector = (module, angle) => {
  const vector = {};
  vector.polar = { module, angle };
  return addCartesian(vector);
};

const buildCartesianVector = (x, y) => {
  const vector = {};
  vector.cartesian = { x, y };
  return addPolar(vector);
};

const addLable = (vector, lable) => {
  vector.lable = lable;
  return vector;
};

export { buildPolarVector, buildCartesianVector, addLable };
