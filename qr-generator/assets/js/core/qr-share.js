export async function shareFile({ blob, filename, title = 'QR code' }) {
  if (!navigator.share) return { ok: false, error: 'Sharing is not supported on this device.' };
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare && !navigator.canShare({ files: [file] })) {
    return { ok: false, error: 'File sharing is not supported on this device.' };
  }
  await navigator.share({ files: [file], title });
  return { ok: true };
}
