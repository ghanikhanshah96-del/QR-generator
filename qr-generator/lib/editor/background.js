export function applyBackground(state, { color, transparent }) {
  state.setDesign({ background: color, transparentBackground: transparent });
}
