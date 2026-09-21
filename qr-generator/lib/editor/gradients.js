export function applyGradient(state, { enabled, color, rotation }) {
  state.setDesign({
    useGradient: enabled,
    gradientColor: color,
    gradientRotation: rotation,
  });
}
