export function applyCorners(state, { square, dot }) {
  state.setDesign({
    cornersSquareType: square,
    cornersDotType: dot,
  });
}
