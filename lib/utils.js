export const roundTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100


export const coerce = (value) => {
  return !isNaN(+value) ? +value : ['true', 'false'].includes(value) ? Boolean(value) : value;
}

export const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

export const svgPoint = (svg, x, y) => {
  const pt = svg.createSVGPoint();
  
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}