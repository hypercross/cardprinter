export function toDataURL(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  if (img.src.startsWith('data')) return;

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const dataurl = canvas.toDataURL('image/webp');

  img.src = dataurl;
}
