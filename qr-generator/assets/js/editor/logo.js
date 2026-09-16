export function applyLogo(state, { dataUrl, name, size, margin }) {
  state.setDesign({
    logoDataUrl: dataUrl,
    logoName: name,
    logoSize: size,
    logoMargin: margin,
    errorCorrectionLevel: 'H',
  });
}

export function clearLogo(state) {
  state.setDesign({ logoDataUrl: null, logoName: null });
}
